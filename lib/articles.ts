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
            issueNumber: matterResult.data.issueNumber ?? null,
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

const rehypeImageToFigure = () => {
    return (tree: any) => {
        const walk = (node: any) => {
            if (node.children) {
                for (let i = 0; i < node.children.length; i++) {
                    const child = node.children[i];
                    
                    // Look ahead: find the next element sibling, skipping whitespace-only text nodes
                    let figcaptionIndex = -1;
                    for (let j = i + 1; j < node.children.length; j++) {
                        const sibling = node.children[j];
                        if (sibling.type === 'element') {
                            if (sibling.tagName === 'figcaption') {
                                figcaptionIndex = j;
                            }
                            break; // First element sibling found, stop looking
                        } else if (sibling.type === 'text' && sibling.value.trim() !== '') {
                            break; // Non-whitespace text found, stop looking
                        }
                    }
                    const hasFigcaptionSibling = figcaptionIndex !== -1;

                    // Case 1: Paragraph containing a single image, followed by a figcaption sibling
                    if (
                        child.type === 'element' && 
                        child.tagName === 'p' && 
                        child.children?.length === 1 && 
                        child.children[0].tagName === 'img' &&
                        hasFigcaptionSibling
                    ) {
                        const img = child.children[0];
                        const figcaptionNode = node.children[figcaptionIndex];
                        node.children[i] = {
                            type: 'element',
                            tagName: 'figure',
                            properties: {},
                            children: [
                                {
                                    type: 'element',
                                    tagName: 'img',
                                    properties: { ...img.properties },
                                    children: []
                                },
                                {
                                    type: 'element',
                                    tagName: 'figcaption',
                                    properties: { ...figcaptionNode.properties },
                                    children: [ ...figcaptionNode.children ]
                                }
                            ]
                        };
                        // Remove the figcaption node from parent list
                        node.children.splice(figcaptionIndex, 1);
                        continue;
                    }

                    // Case 2: Standalone image, followed by a figcaption sibling
                    if (
                        child.type === 'element' && 
                        child.tagName === 'img' &&
                        hasFigcaptionSibling
                    ) {
                        const figcaptionNode = node.children[figcaptionIndex];
                        node.children[i] = {
                            type: 'element',
                            tagName: 'figure',
                            properties: {},
                            children: [
                                {
                                    type: 'element',
                                    tagName: 'img',
                                    properties: { ...child.properties },
                                    children: []
                                },
                                {
                                    type: 'element',
                                    tagName: 'figcaption',
                                    properties: { ...figcaptionNode.properties },
                                    children: [ ...figcaptionNode.children ]
                                }
                            ]
                        };
                        // Remove the figcaption node
                        node.children.splice(figcaptionIndex, 1);
                        continue;
                    }

                    // Case 3: Paragraph containing a single image without a sibling figcaption
                    if (
                        child.type === 'element' && 
                        child.tagName === 'p' && 
                        child.children?.length === 1 && 
                        child.children[0].tagName === 'img'
                    ) {
                        const img = child.children[0];
                        node.children[i] = {
                            type: 'element',
                            tagName: 'figure',
                            properties: {},
                            children: [
                                {
                                    type: 'element',
                                    tagName: 'img',
                                    properties: { ...img.properties },
                                    children: []
                                }
                            ]
                        };
                        continue;
                    }

                    // Case 4: Standalone image without a sibling figcaption
                    if (child.type === 'element' && child.tagName === 'img') {
                        node.children[i] = {
                            type: 'element',
                            tagName: 'figure',
                            properties: {},
                            children: [
                                {
                                    type: 'element',
                                    tagName: 'img',
                                    properties: { ...child.properties },
                                    children: []
                                }
                            ]
                        };
                        continue;
                    }
                    
                    // Recurse into children
                    walk(child);
                }
            }
        };
        walk(tree);
    };
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
        .use(remarkRehype, { allowDangerousHtml: true })        // Maps Markdown elements into HTML syntax structures
        .use(rehypeKatex, {       // Compiles LaTeX tokens into optimized DOM elements
            output: "htmlAndMathml",
            trust: true
        })
        .use(rehypeImageToFigure) // Wraps images in figures with captions
        .use(rehypeStringify, { allowDangerousHtml: true })     // Serializes structural tree blocks to output strings
        .process(matterResult.content);

    const contentHtml = processedContent.toString();
    const readingTime = calculateReadingTime(matterResult.content);

    return {
        id,
        contentHtml,
        issueNumber: matterResult.data.issueNumber ?? null,
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