"use client";
import Link from "next/link";
import React from "react";
import type {ArticleItem} from "@/types";
import Image from "next/image";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {AspectRatio} from "@/components/ui/aspect-ratio";

interface Props {
    category: string;
    articles: ArticleItem[];
}

export const ArticleItemList: React.FC<Props> = ({category, articles}) => {
    return (
        <Card
            className="rounded-none border-none bg-transparent shadow-none">
            <CardHeader className="px-0 pt-0 pb-6 mb-8 border-b-2 border-foreground relative">
                <h3 className="text-3xl md:text-4xl font-serif font-black tracking-tighter text-foreground uppercase italic">
                    {category}
                </h3>
                <div className="absolute -bottom-[2px] left-0 w-12 h-[2px] bg-primary" />
            </CardHeader>

            <CardContent className="px-0 py-0 flex flex-col gap-10">
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <Link
                            href={`/${article.id}`}
                            key={article.id}
                            className="group flex flex-col gap-6 pb-10 border-b border-foreground/10 last:border-0"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                {article.imageUrl && (
                                    <div
                                        className="relative w-full md:w-32 h-48 md:h-32 min-w-[8rem] overflow-hidden border border-foreground/10 p-1 bg-white shadow-sm transform -rotate-1 group-hover:rotate-0 transition-transform duration-500">
                                        <AspectRatio ratio={1}>
                                            <Image
                                                src={article.imageUrl}
                                                alt={article.title}
                                                fill
                                                className="object-cover grayscale-[0.8] contrast-125 group-hover:grayscale-0 transition-all duration-700"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 20vw, 128px"
                                            />
                                        </AspectRatio>
                                    </div>
                                )}

                                <div className="flex-1 space-y-3">
                                    <h4 className="text-2xl font-serif font-black tracking-tight text-foreground leading-tight group-hover:text-primary transition-colors decoration-primary/20 decoration-2 underline-offset-4">
                                        {article.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground line-clamp-2 font-serif opacity-80 leading-relaxed italic">
                                        {article.excerpt}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-2">
                                    {article.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[10px] font-black uppercase tracking-widest text-primary/70 border-r border-foreground/20 pr-3 last:border-0"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                                    {article.readingTime} min read — Dispatch
                                </span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="py-8 text-center text-muted-foreground italic border border-dashed border-foreground/20">
                        <p className="text-xs uppercase tracking-widest">Section Currently Empty</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};