---
title: "From Prototype to Production: Architecting a Full-Stack Local AI Chatbot"
category: "System Design"
date: "12-05-2026"
author: "Ajith Goveas"
tags: [ "LLM", "Ollama", "Golang", "Android", "Jetpack Compose", "System Architecture" ]
image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
excerpt: "Building 'Promptly AI': A deep dive into overcoming context bloat, database latency, and streaming bottlenecks to create a production-ready, local LLM mobile client."
---

Building a "Hello World" wrapper around an AI API is trivial. You send a string, you wait, and you receive a string. But
building a high-performance, fully local, persistent chatbot that rivals the UX of commercial products like Gemini or
ChatGPT is an entirely different engineering challenge.

Over the past few months, I have been developing **Promptly AI**, a native Android application powered by a custom
Golang middleware and a local instance of [Ollama](https://ollama.com/) running models like `phi3` and `gemma:2b`. What
started as a basic proof-of-concept quickly hit the harsh realities of local compute: VRAM exhaustion, crippling
database latency during long threads, and UI memory leaks.

Here is a deep dive into the engineering solutions implemented to transition Promptly from a fragile prototype to a
robust, production-grade ecosystem.

---

## 🏎️ The Latency Bottleneck: Streaming & Cold Starts

The most critical metric for an interactive AI application is the <mark>Time to First Token (TTFT)</mark>. When running
models
locally, we lack the massive, multi-tiered GPU clusters of cloud providers to mask architectural inefficiencies. If the
system is slow, the user feels every millisecond of it.

![Abstract glowing circuits representing data streams](https://images.unsplash.com/photo-1550751827-4bd374c3f58b)
<figcaption>Fig 1: Real-time token streaming requires an unbroken, highly efficient pipeline from the GPU to the mobile UI.</figcaption>

### 1. Defeating the "Cold Start" Freeze

By default, Ollama unloads a model from VRAM after 5 minutes of inactivity to free up system resources. When a user
returns to the app and sends a message, loading a 4GB+ model back into memory from disk causes a massive 5–10 second
freeze.

**The Countermeasure:** We override Ollama's default lifecycle management by injecting a persistent `keep_alive`
parameter in our Go middleware's API payload. This keeps the active model hot in the GPU memory for extended,
uninterrupted sessions.

```json
{
  "model": "phi3",
  "prompt": "Explain quantum entanglement.",
  "keep_alive": -1
}
```

*Note: Setting `keep_alive` to `-1` forces indefinite retention. In production, we dynamically set this to `1h` (one
hour) to balance responsiveness with overall system health.*

### 2. Ktor and Server-Sent Events (SSE)

Instead of waiting for the full LLM response to generate (which could take 20 seconds for a long essay), the Go backend
streams individual tokens to the client. We achieve this
using [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events), a unidirectional
protocol that is much lighter than WebSockets.

Initially, the Android client utilized `OkHttp-SSE`. While functional for short bursts, it caused subtle memory leaks
and UI stuttering during prolonged streams because connection teardowns weren't always clean.

**The Fix:** We executed a complete migration to the **[Ktor 3.0](https://ktor.io/)** native SSE engine. Ktor, being
built entirely on Kotlin Coroutines, handles stream cancellation inherently. To prevent "message duplication"—a
notoriously common SSE bug where the UI appends the final summarized payload to the already-streamed text—the Go backend
was refactored to send strictly incremental deltas, followed by a deliberate `[DONE]` event to trigger the database
commit.

---

## 🧠 The Context Governor: Beating the Memory Wall

Every LLM operates within a finite [Context Window](https://www.promptingguide.ai/introduction/basics)—its short-term
memory limit. As a user converses, the prompt grows linearly. Eventually, the model either crashes with an
Out-of-Memory (OOM) error or becomes agonizingly slow due to quadratic scaling in the attention mechanism.

### The Solution: A Hybrid Memory System

To solve this, I designed a **Context Governor** within the Fiber v2 middleware. It intercepts every request and
manipulates the prompt structure *before* it reaches the inference engine.

1. **The Sliding Window:** We strictly cap the active context array to the last 6 messages.
2. **Recursive Summarization (Memory Injection):** Older messages aren't just deleted; they are compressed. When the
   token count hits a threshold, a background Goroutine summarizes the historical context into a concise 3-sentence "
   memory block." This is injected invisibly as a `<system>` instruction.
3. **Auto-Truncation:** If an incoming user prompt exceeds 3,000 characters, auto-truncation logic triggers,
   guaranteeing that hardware limits aren't breached by a single massive copy-paste job.

> "Optimization is not about achieving infinite capacity; it is about aggressively managing what the system chooses to
> forget so it can focus on what matters now."

---

## 🗄️ Overcoming Database Latency

As Promptly gained persistence—allowing users to save, name, and resume threads—I hit a classic database scaling issue.

Fetching thousands of historical messages for a single session using standard SQL `OFFSET/LIMIT` queries caused the UI
to hang. Traditional `OFFSET` requires the database to scan and discard rows before returning the requested data,
resulting in $O(N)$ performance degradation as the chat grows.

### Keyset Pagination to the Rescue

To fix this, the backend's PostgreSQL integration (via GORM) was completely rewritten to use
**[Keyset Pagination](https://use-the-index-luke.com/sql/partial-results/fetch-next-page)** (often called cursor-based
pagination).

Instead of asking the database for "Page 5," we ask for "The 20 messages that occurred *before* timestamp `X`."

```go
// GORM Implementation of Keyset Pagination
func GetHistory(sessionID string, lastTimestamp time.Time, limit int) []Message {
    var messages []Message
    db.Where("session_id = ? AND created_at < ?", sessionID, lastTimestamp).
       Order("created_at DESC").
       Limit(limit).
       Find(&messages)
    return messages
}
```

By creating a Composite Index on `(session_id, created_at DESC)`, the database seeks directly to the timestamp and reads
the next 20 rows. This executes in constant time—$O(1)$—regardless of whether the table has ten rows or ten million. The
Android client seamlessly loads history as the user scrolls up, maintaining a buttery 60fps.

---

## 📱 Crafting a Premium Native Experience

An optimized backend means nothing if the client feels cheap. The Android app was overhauled to provide a premium,
modern experience utilizing the bleeding edge of Google's Android ecosystem.

* **Reactive UI:** Implemented strict Clean Architecture with
  **[Jetpack Compose](https://developer.android.com/jetpack/compose)**. State management is handled
  entirely via `ViewModel` and Kotlin `StateFlow`.
* **Midnight Onyx Design:** A custom design system featuring deep contrasts, glassmorphic UI components, and dynamic
  typography that rivals native OS applications.
* **Sub-millisecond Persistence:** User preferences (like the system-wide Dark/Light theme toggle) are stored using
  **[Jetpack DataStore](https://developer.android.com/topic/libraries/architecture/datastore)**, a coroutine-based,
  asynchronous data storage solution that entirely replaces the legacy,
  thread-blocking `SharedPreferences`.
* **Security & Scoping:** All API routes are protected by JWT authentication. Every chat and history request is strictly
  scoped to the authenticated `user_id` at the repository level, eliminating IDOR vulnerabilities.

---

## 📊 Performance Benchmarks

Balancing local hardware constraints requires intentional trade-offs. Here is how our optimizations impacted performance
using an 8B parameter model running on consumer-grade hardware:

| System State                       | Initial Load (Cold) | Response Start (Hot) | Context Limit          |
|------------------------------------|---------------------|----------------------|------------------------|
| **Baseline (Naïve Setup)**         | 8.2s                | 9.5s                 | Fails at 4k tokens     |
| **Streaming + Keep-Alive**         | 0.5s                | 1.2s                 | Fails at 4k tokens     |
| **Full Stack (Governor + Keyset)** | **0.5s**            | **0.8s**             | **Infinite (Rolling)** |

Note: Inference speeds vary based on model quantization. We primarily deploy 4-bit (`Q4_K_M`) models to balance
reasoning fidelity with a minimal VRAM footprint (~4.8 GB), ensuring the UI thread is never starved of resources.

---

## 🚀 The Road Ahead

Taking Promptly AI from a single-file Go script to a modular, decoupled ecosystem has been a masterclass in modern
system design. It proves that local AI is no longer just a hobbyist's sandbox; with the right architectural patterns, it
is a viable, privacy-first alternative to cloud monoliths.

**Future Architectures:**

1. **Retrieval-Augmented Generation (RAG):** I am currently evaluating [ChromaDB](https://www.trychroma.com/) for
   integrating a local vector database. This will allow the chatbot to securely "read" local PDFs and codebase
   directories without exposing intellectual property to the internet.
2. **Multi-Modal Input:** Upgrading the Android client to support image uploads, processing them locally via vision
   models like **LLaVA**.
3. **Voice Engine:** Implementing **[OpenAI Whisper](https://github.com/openai/whisper)** for local, on-device, highly
   accurate speech-to-text.

The future of AI isn't just in massive data centers; it's decentralized, private, and running locally in our pockets.