export type ArticleItem = {
    id: string;
    title: string;
    date: string; // Format: "DD-MM-YYYY"
    author: string;
    category: string;
    tags: string[]; // Array of related topics (e.g., ["Technology", "AI"])
    excerpt: string; // Short summary of the article
    contentHtml: string; // Full processed HTML content from Markdown
    imageUrl?: string; // Optional featured image URL
    readingTime: number; // Estimated reading time in minutes
};