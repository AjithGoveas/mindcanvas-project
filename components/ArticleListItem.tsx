"use client";
import Link from "next/link";
import React from "react";
import type {ArticleItem} from "@/types";
import Image from "next/image";

interface Props {
    category: string;
    articles: ArticleItem[];
}

const ArticleItemList: React.FC<Props> = ({category, articles}) => {
    return (
        <div
            className="flex flex-col gap-8 bg-neutral-200 dark:bg-neutral-800 p-8 rounded-xl shadow-lg transition-all hover:shadow-xl"
        >
            {/* Category Heading */}
            <h2 className="font-cormorant text-4xl font-bold text-neutral-900 dark:text-neutral-100 border-b border-neutral-400 dark:border-neutral-600 pb-3 tracking-tight">
                {category}
            </h2>

            {/* Articles List */}
            <div className="flex flex-col gap-6 font-poppins text-lg">
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <Link
                            href={`/${article.id}`}
                            key={article.id}
                            className="flex flex-row gap-6 items-center hover:bg-neutral-300 dark:hover:bg-neutral-700 p-5 rounded-lg transition duration-300"
                        >
                            {/* Thumbnail */}
                            {article.imageUrl && (
                                <Image
                                    src={article.imageUrl}
                                    alt={article.title}
                                    width={80}
                                    height={80}
                                    className="rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                                />
                            )}

                            {/* Title & Tags */}
                            <div className="flex flex-col">
                                <p className="text-neutral-900 dark:text-neutral-100 font-semibold text-lg">
                                    {article.title}
                                </p>
                                <div className="flex gap-3 mt-2 flex-wrap">
                                    {article.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-amber-300 dark:bg-amber-600 text-neutral-800 dark:text-neutral-100 text-sm px-3 py-1 rounded-md shadow-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-neutral-600 dark:text-neutral-400 italic text-center">
                        No articles available.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ArticleItemList;
