# MindCanvas
*A Curated Collection of Ideas, Painted in Markdown.*

MindCanvas is a modern, high-performance blog engine built for speed, simplicity, and a premium reading experience. It leverages the latest web technologies to deliver a seamless content-delivery pipeline.

## 🚀 How It Works
MindCanvas follows a "Content-as-Code" philosophy:
1.  **Markdown Source**: Articles are authored in standard Markdown (`.md`) files located in the `/articles` directory.
2.  **Metadata (Frontmatter)**: Each article includes YAML frontmatter for structured data like `title`, `date`, `category`, and `author`.
3.  **Parsing & Processing**: 
    - `gray-matter` extracts metadata and raw content.
    - `remark` and `remark-html` transform Markdown into clean, semantic HTML.
    - `remark-gfm` adds support for GitHub Flavored Markdown (tables, task lists, etc.).
4.  **Static Generation**: Next.js 15 (App Router) pre-renders these pages for lightning-fast load times.
5.  **Dynamic Rendering**: Each article is dynamically routed via `app/[slug]`, ensuring a clean URL structure.

## ✨ Key Features
-   **⏱️ Automated Reading Time**: Instant calculation of estimated reading time for every article.
-   **📂 Smart Categorization**: Automatic grouping of articles by categories defined in frontmatter.
-   **🌗 Dark Mode Ready**: Native support for dark/light themes using `next-themes`.
-   **🎨 Premium Typography**: A curated mix of Serif and Sans-Serif fonts for maximum readability.
-   **📱 Fully Responsive**: Optimized for every screen size, from mobile to ultra-wide monitors.
-   **⚡ Powered by Turbopack**: Blazing-fast development cycles and build times.

## 🛠️ Tech Stack
-   **Core**: [Next.js 15 (App Router)](https://nextjs.org), [React 19](https://react.dev)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com), [Radix UI](https://www.radix-ui.com), [Lucide Icons](https://lucide.dev)
-   **Content**: Markdown, Gray-matter, Remark, Moment.js
-   **Language**: [TypeScript](https://www.typescriptlang.org)

## 🏗️ Project Structure
```text
├── app/          # Next.js App Router (Layouts, Pages, Routes)
├── articles/     # The source of truth: Your Markdown files
├── components/   # Reusable UI components (Radix/Shadcn inspired)
├── lib/          # Core logic: Article parsing, helper functions
├── public/       # Static assets (Images, Favicons)
└── types/        # TypeScript type definitions
```

## 🏁 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Add a New Article**:
    Simply drop a `.md` file into the `/articles` folder with the following frontmatter:
    ```yaml
    ---
    title: "My New Adventure"
    date: "11-05-2026"
    category: "Philosophy"
    author: "Your Name"
    excerpt: "A brief summary of your thoughts."
    image: "/images/hero.jpg"
    ---
    # Content goes here
    ```

## 🗺️ Future Roadmap
- [ ] **Editor Section**: A section where the user can edit the markdown files and save them to the articles folder.
- [ ] **Database**: Add a database to store the articles.
- [x] **Search**: Global search functionality to find articles by title, tag, or content.
- [ ] **Newsletter**: Integrated subscription form for reader updates.
- [ ] **Comments**: Giscus or Utterances integration for community engagement.
- [ ] **Image Optimization**: Automatic thumbnail generation and blur-up loading.
- [ ] **RSS Feed**: XML feed for blog aggregators and readers.
- [x] **SEO Optimization**: Automated meta-tag generation based on article metadata.

---
*Built with ❤️ by [Ajith Goveas](https://ajith-goveas-portfolio.vercel.app/)*.
