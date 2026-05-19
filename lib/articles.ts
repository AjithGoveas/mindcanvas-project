import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import moment from 'moment';

// Modern Unified AST Processing Stack
import {unified} from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";

import type {ArticleItem} from "@/types";

const articlesDirectory = path.join(process.cwd(), 'articles');

const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
};

export const getSortedArticles = (): ArticleItem[] => {
    const fileNames = fs.readdirSync(articlesDirectory).filter(fileName => fileName.endsWith(".md"));

    const allArticlesData = fileNames.map((fileName): ArticleItem => {
        const id = fileName.replace(/\.md$/, "");

        const fullPath = path.join(articlesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf-8");

        const matterResult = matter(fileContents);
        const format = "DD-MM-YYYY";
        const dateTimestamp = moment(matterResult.data.date, format).valueOf();

        return {
            id: id,
            title: matterResult.data.title,
            date: matterResult.data.date,
            dateTimestamp: dateTimestamp,
            category: matterResult.data.category,
            author: matterResult.data.author,
            tags: matterResult.data.tags ?? [],
            excerpt: matterResult.data.excerpt ?? "",
            contentHtml: "", // Filled in `getArticleData`
            imageUrl: matterResult.data.image ?? null,
            readingTime: calculateReadingTime(matterResult.content),
        };
    });

    return allArticlesData.sort((a, b) => (b.dateTimestamp || 0) - (a.dateTimestamp || 0));
};

export const getCategorizedArticles = (): Record<string, ArticleItem[]> => {
    const sortedArticles = getSortedArticles();
    const categorizedArticles: Record<string, ArticleItem[]> = {};

    sortedArticles.forEach(article => {
        if (!categorizedArticles[article.category]) {
            categorizedArticles[article.category] = [];
        }
        categorizedArticles[article.category].push(article);
    });

    return categorizedArticles;
};

export const getArticleData = async (id: string): Promise<ArticleItem> => {
    const fullPath = path.join(articlesDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf-8");

    const matterResult = matter(fileContents);

    // Upgraded parsing chain to handle GFM Markdown + Inline/Block LaTeX elements
    const processedContent = await unified()
        .use(remarkParse)         // Tokenizes the raw input text file
        .use(remarkGfm)           // Preserves broadsheet Markdown features like columns/tables
        .use(remarkMath)          // Isolates inline ($) and display ($$) math boundaries
        .use(remarkRehype)        // Maps Markdown elements into HTML syntax structures
        .use(rehypeKatex, {       // Compiles LaTeX tokens into optimized DOM elements
            output: "htmlAndMathml",
            trust: true
        })
        .use(rehypeStringify)     // Serializes structural tree blocks to output strings
        .process(matterResult.content);

    const contentHtml = processedContent.toString();
    const readingTime = calculateReadingTime(matterResult.content);

    return {
        id,
        contentHtml,
        title: matterResult.data.title,
        category: matterResult.data.category,
        date: moment(matterResult.data.date, "DD-MM-YYYY").format("MMMM Do YYYY"),
        author: matterResult.data.author,
        tags: matterResult.data.tags ?? [],
        excerpt: matterResult.data.excerpt ?? "",
        imageUrl: matterResult.data.image ?? null,
        readingTime,
    };
};