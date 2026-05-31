---
issueNumber: 4
title: "Breaking Language Barriers in Real Time: Engineering an On-Device Script Transliterator"
category: "Mobile App Development"
date: "31-05-2026"
author: "Ajith Goveas"
tags: [ "Android", "Camera2 API", "OCR", "Jetpack Compose", "Smart India Hackathon", "System Architecture" ]
image: "https://images.unsplash.com/photo-1522442676585-c751dab71864?q=80&w=1170&auto=format&fit=crop"
excerpt: "A technical retrospective on building ScriptBridge for the Smart India Hackathon: Architecting a low-latency, cross-script translation pipeline leveraging raw mobile camera frames and native OCR engines."
---

I was going through my GitHub and suddenly stumbled on this project. It has been a year since my team and I built it under the high-intensity pressure of the **Smart India Hackathon (SIH)**, and looking back at the codebase reminded me of just how challenging the engineering constraints were.

Building a standard translation app is straightforward: accept a text input, transmit it to a cloud API, wait for a processed string, and render the result. While this architecture handles structured digital text, it breaks down entirely in dynamic, real-world environments where language is tightly coupled with physical layout—such as physical navigation signage, transit schedules, and regional multi-script public boards.

The repository we built, [ScriptBridge](https://github.com/AjithGoveas/transliterator), was our answer to this problem: a native Android application engineered to capture, isolate, and transliterate regional Indian scripts instantly through an active, on-device camera pipeline.

![A developer testing code on a mobile device](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop)
<figcaption>Fig 1: Designing a low-latency, on-device experience starts with keeping the camera and interface responsive in real time.</figcaption>

Transitioning from a basic Optical Character Recognition (OCR) prototype to a production-ready mobile system required overcoming significant constraints: frame-buffer latency, heavy UI thread blocking, and extreme script recognition degradation under unpredictable physical conditions.

---

## 👥 The Problem Space: Script Isolation and Real-World Friction

The core issue stems from structural friction during travel, migration, or historical study. In a linguistically diverse ecosystem like India, a traveler moving across state borders doesn't just face a change in vocabulary—the entire script changes.

When a person from Karnataka (using Kannada script) travels to Maharashtra (using Devanagari script), standard translation tools often fail to bridge the immediate gap. The traveler doesn't necessarily need a deep semantic translation of a proper noun on a sign board; they simply need to know how to pronounce it phonetically.

Traditional cloud-dependent machine translation utilities introduce three major points of friction:

1. **Network Dependency:** Critical transit hubs, rural roads, and deep archaeological sites frequently lack high-speed connectivity, rendering cloud APIs useless.
2. **Contextual Layout Rupture:** Traditional tools strip text out of its visual context, returning a flat string that detaches the information from the physical layout of the sign.
3. **Phonetic Distortion:** Standard translators try to translate proper nouns semantically instead of preserving their phonetic identity through accurate transliteration.

### Beyond Personal Travel: Expanding the Domain

This problem extends far beyond daily commuting. We identified two major areas where real-time, on-device transliteration serves as a critical utility:

* **Socio-Economic Inclusion:** Helping migrant laborers navigate administrative environments, public banking forms, and safety mandates in states where they lack script literacy.
* **Preservation & Historical Research:** Serving as a field utility for linguists and researchers to read, index, and document historical rock inscriptions or fragile manuscripts, immediately bringing ancient or regional scripts into a readable modern script format without risking fragile materials or waiting for cloud processing.

![A traveler looking at structural signage in a public station](https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop)
<figcaption>Fig 2: Script transliteration becomes especially valuable when travelers must understand public signage without waiting for network access.</figcaption>

---

## 📸 Overcoming the Mobile Vision Bottleneck: Camera2 API

The primary engineering bottleneck in any live scanner layout is balancing image capture quality with frame processing velocity. High-level frameworks like standard intents or basic camera views do not grant direct access to raw image buffers quickly enough. To achieve sub-millisecond processing pipelines, we bypassed high-level wrappers and implemented the low-level **Camera2 API**.

### 1. Non-Blocking Frame Allocation

Using Camera2 allowed us to control the allocation of target output surfaces explicitly. We routed the camera sensor stream simultaneously into two separate directions:

* **The Preview Surface:** A direct texture view managed by the hardware to paint the live view on the screen at a smooth, uninhibited frame rate.
* **The ImageReader Surface:** A dedicated internal allocation pool using the `YUV_420_888` image format, capturing raw frame arrays specifically for the processing pipeline.

By isolating the analysis array from the display texture, we ensured that heavy computations never starved the main rendering loop of resources.

### 2. Eliminating Memory Leaks in Image Analysis Loops

In an active scanning loop running at 30 frames per second, creating new object instances for every frame will instantly trigger the garbage collector, causing severe UI micro-stutters.

We mitigated this by deploying an explicit buffer management pattern. Every time the camera sensor drops a frame into the `ImageReader`, the native array is locked, processed sequentially inside a separate background thread pool, and then strictly closed via explicit resource cleanup blocks before the next image buffer arrives.

![Close-up of a high-performance camera lens array](https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop)
<figcaption>Fig 3: Raw frame capture and disciplined buffer cleanup are key to sustaining smooth camera-driven processing loops.</figcaption>

---

## 🧠 The Pipeline Architecture: From Photon to Phoneme

Once a clean frame is extracted from the sensor layer, it passes into our decoupled text processing engine. The system is designed as a unidirectional data pipeline executing across three isolated, sequential steps.


```

[Raw Camera Sensor]
│
▼ (YUV_420_888 Frame)
[ImageReader Buffer Pool] ──(Asynchronous Thread)──► [On-Device OCR Engine]
│
▼ (Bounding Boxes & Text)
[Phonetic Transliteration Engine] ◄──(Coroutine)─── [Layout & Geometry Mapper]
│
▼ (State Flow Emission)
[Jetpack Compose Layer (Immutable UI Overlay)]

```

### Step 1: On-Device Optical Character Recognition (OCR)

The raw image buffer is converted into a native bitmap wrapper. Rather than piping this data over a network, an on-device machine learning engine runs inference locally to isolate character contours, group them into structural bounding boxes, and extract the raw character characters.

### Step 2: Script Tokenization & Layout Mapping

Once strings are extracted, their geometric coordinates on the screen matrix are calculated. This step is critical to ensure that when the transliterated text is rendered, it maps directly over the original script, preserving the spatial orientation, reading order, and scale of the physical signage.

### Step 3: Core Phonetic Transliteration Engine

The extracted characters pass into our custom linguistic module. Instead of computing semantic translations, it runs a deterministic character mapping algorithm that swaps phonetic characters across regional scripts. If a Devanagari sign reads "मुंबई", the engine directly maps the phonetic constructs to Kannada ("ಮುಂಬೈ") or English script ("Mumbai") instantly.

To prevent blocking user interactions during tokenization, the entire multi-tiered engine is wrapped inside a dedicated Kotlin Coroutines pipeline utilizing `Dispatchers.Default` for structural parsing and `Dispatchers.IO` for dictionary lookups.

---

## 🗄️ State Optimization and UI Layer Architecture

An optimized vision backend means nothing if the client interface feels sluggish or unpolished. The frontend layout was architected utilizing a fully reactive, modern declarative approach.

* **Jetpack Compose State Management:** Bounding boxes and recognized text streams are modeled as explicit states using Kotlin `StateFlow`. The UI components observe these state vectors, updating live overlay layers cleanly without manual interface invalidations.
* **Threading Boundary Protection:** All heavy operations are strictly cordoned off behind clean repository boundaries. The UI view layer simply receives immutable text coordinates and formatted strings to display, keeping the main layout thread optimized for screen drawing.

---

## 📊 Operational Performance Impact

Balancing continuous frame capture with real-world mobile resource constraints required intentional trade-offs. Here is how our structural design choices directly impacted operational metrics during extended use:

| Architecture Profile                        | Processing Latency | UI Frame Stability              | Battery Thermal Impact                      |
|:--------------------------------------------|:-------------------|:--------------------------------|:--------------------------------------------|
| **Naïve Single-Thread Setup**               | 350ms per frame    | Drops to ~18fps (Heavy stutter) | High thermal throttling within 3 min        |
| **Decoupled Camera2 + Coroutines Pipeline** | **42ms per frame** | **Locked 60fps performance**    | **Minimal / Stable during sustained usage** |

---

## 🚀 The Road Ahead: Open Source & Language Research

While ScriptBridge successfully delivered a fast, reliable, on-device pipeline during the Smart India Hackathon, it represents only the structural foundation for a much broader initiative. The next phase of development focuses on moving from a rules-based mapping client to an open-source framework dedicated to deep linguistic accessibility and script research.

### 1. Hybrid AI/ML Enhancements

We are planning to transition the core transliteration engine from static character mapping to low-footprint, on-device token models. This will allow the system to handle complex character combinations, contextual character shifts, and dialects that rules-based engines fail to resolve correctly.

### 2. Digitization of Rare and Tribal Scripts

A major goal is to extend support to endangered, ancient, or unscripted regional languages that lack formal digital documentation. By partnering with research institutions, we aim to use our real-time bounding box and extraction layout to build training datasets, helping language researchers automatically preserve, catalog, and digitize historical inscriptions directly from the field.

### 3. Open-Source Collaboration

To scale this effectively, the codebase is being structured for public open-source contribution. By decoupling the camera processing pipeline from the core linguistic engine, developers and language experts worldwide can contribute localized script plugins without needing to understand complex mobile vision or graphics configurations.

You can review the current implementation, explore the architecture, or contribute to the project directly on GitHub at [AjithGoveas/transliterator](https://github.com/AjithGoveas/transliterator).

The future of language access isn't about centralized cloud translation centers; it's decentralized, privacy-first, and running on open-source infrastructure right in our pockets.