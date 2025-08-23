"use client";
import Link from "next/link";
import React from "react";
import type {ArticleItem} from "@/types";
import Image from "next/image";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {AspectRatio} from "@/components/ui/aspect-ratio";

interface Props {
    category: string;
    articles: ArticleItem[];
}

export const ArticleItemList: React.FC<Props> = ({category, articles}) => {
    return (
        <Card
            className="rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all">
            <CardHeader className="px-6 pt-6 pb-4 border-b border-border">
                <h3 className="text-3xl font-serif font-bold tracking-tight text-foreground">
                    {category}
                </h3>
            </CardHeader>

            <CardContent className="px-6 py-4 space-y-6">
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <Link
                            href={`/${article.id}`}
                            key={article.id}
                            className="group flex flex-col gap-4 rounded-lg p-4 transition-colors hover:bg-muted/40"
                        >
                            <div className="flex items-start gap-4">
                                {article.imageUrl && (
                                    <div
                                        className="relative w-20 h-20 min-w-[5rem] overflow-hidden rounded-md shadow-sm">
                                        <AspectRatio ratio={1}>
                                            <Image
                                                src={article.imageUrl}
                                                alt={article.title}
                                                fill
                                                className="object-cover rounded-md transition-transform duration-300 group-hover:scale-[1.03]"
                                            />
                                        </AspectRatio>
                                    </div>
                                )}

                                <p className="text-lg font-medium text-foreground leading-snug font-sans">
                                    {article.title}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {article.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        className="bg-primary text-primary-foreground px-3 py-1 text-[0.65rem] sm:text-xs md:text-sm font-semibold rounded-full shadow-sm hover:bg-primary/80 transition"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="py-8 text-center text-muted-foreground italic">
                        <p className="text-sm">No articles available in this category.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};