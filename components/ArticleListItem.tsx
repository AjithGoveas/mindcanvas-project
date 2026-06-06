"use client";
import Link from "next/link";
import React from "react";
import type {ArticleItem} from "@/types";
import Image from "next/image";
import {Card, CardContent, CardHeader} from "@/components/ui/card";

interface Props {
    category: string;
    articles: ArticleItem[];
}

const BookmarkButton: React.FC<{
    id: string;
    isBookmarked: boolean;
    onToggle: (id: string, e: React.MouseEvent) => void;
}> = ({ id, isBookmarked, onToggle }) => {
    return (
        <button
            onClick={(e) => onToggle(id, e)}
            className="p-1.5 hover:scale-115 hover:bg-primary/5 active:scale-95 transition-all focus:outline-none flex items-center justify-center cursor-pointer z-10 rounded-full"
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Dispatch"}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill={isBookmarked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-3.5 h-3.5 transition-colors ${
                    isBookmarked ? "text-primary fill-primary" : "text-foreground/45 hover:text-primary"
                }`}
            >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
        </button>
    );
};

const CoffeeMeter: React.FC<{ time: number }> = ({ time }) => {
    let classification = "Quick Sip";
    let cupsCount = 1;
    if (time > 6) {
        classification = "Slow Drip";
        cupsCount = 3;
    } else if (time >= 3) {
        classification = "Fresh Brew";
        cupsCount = 2;
    }
    const cups = "☕".repeat(cupsCount);

    return (
        <span 
            className="flex items-center gap-1.5 text-[9px] font-mono opacity-70 font-bold uppercase tracking-wider text-foreground/75" 
            title={`Steep Duration: ~${time} mins`}
        >
            <span>{cups}</span>
            <span>{classification} (~{time} min)</span>
        </span>
    );
};

const InkStamp: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => {
    return (
        <div className={`absolute select-none pointer-events-none border-2 border-dashed px-2.5 py-0.5 font-mono text-[9px] font-black tracking-widest uppercase rounded-sm border-primary/25 text-primary/35 -rotate-6 transform shadow-[0_0_0_1px_rgba(var(--primary),0.02)] ${className}`}>
            {text}
        </div>
    );
};

const SingleColumnLayout: React.FC<{
    article: ArticleItem;
    bookmarks: string[];
    onToggleBookmark: (id: string, e: React.MouseEvent) => void;
}> = ({ article, bookmarks, onToggleBookmark }) => {
    const isBookmarked = bookmarks.includes(article.id);
    return (
        <div className="relative group border border-foreground/10 hover:border-foreground/30 p-5 sm:p-6 bg-card hover:bg-primary/2 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(78,52,46,0.04)] h-full flex flex-col justify-between rounded-sm">
            <InkStamp text="Latest dispatch" className="top-6 right-6" />
            <Link href={`/blog/${article.id}`} className="flex flex-col gap-5 h-full">
                {article.imageUrl && (
                    <div className="relative w-full aspect-16/10 sm:aspect-4/3 overflow-hidden border border-foreground/10 p-2 bg-white shadow-sm transform -rotate-1 group-hover:rotate-0 transition-transform duration-500">
                        <div className="relative w-full h-full overflow-hidden">
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                className="object-cover grayscale-[0.8] contrast-125 group-hover:grayscale-0 transition-all duration-700"
                                sizes="(max-width: 768px) 100vw, 400px"
                            />
                        </div>
                    </div>
                )}
                <div className="flex-1 space-y-3 mt-2">
                    <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                            <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-primary/70 border-r border-foreground/20 pr-2 last:border-0">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h4 className="text-2xl font-serif font-black tracking-tight text-foreground leading-tight group-hover:text-primary transition-colors decoration-primary/20 decoration-2 underline-offset-4">
                        {article.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-4 font-serif opacity-80 leading-relaxed italic text-justify">
                        {article.excerpt}
                    </p>
                </div>
            </Link>
            <div className="pt-4 border-t border-dashed border-foreground/20 mt-5 flex justify-between items-center">
                <div className="flex flex-col text-[10px] font-bold uppercase tracking-widest text-foreground/50">
                    <span>By {article.author}</span>
                </div>
                <div className="flex items-center gap-3">
                    <CoffeeMeter time={article.readingTime} />
                    <BookmarkButton id={article.id} isBookmarked={isBookmarked} onToggle={onToggleBookmark} />
                </div>
            </div>
        </div>
    );
};

const TwoColumnLayout: React.FC<{
    articles: ArticleItem[];
    bookmarks: string[];
    onToggleBookmark: (id: string, e: React.MouseEvent) => void;
}> = ({ articles, bookmarks, onToggleBookmark }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {articles.map((article, idx) => {
                const isBookmarked = bookmarks.includes(article.id);
                return (
                    <div
                        key={article.id}
                        className={`relative group border border-foreground/10 hover:border-foreground/30 p-5 bg-card hover:bg-primary/2 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(78,52,46,0.04)] flex flex-col justify-between rounded-sm ${
                            idx === 1 ? "md:border-l md:border-foreground/15 md:pl-8 lg:pl-12" : ""
                        }`}
                    >
                        {idx === 0 && <InkStamp text="Category Feature" className="top-5 right-5" />}
                        <Link href={`/blog/${article.id}`} className="flex flex-col gap-5 h-full justify-between">
                            <div className="space-y-4">
                                {article.imageUrl && (
                                    <div className="relative w-full aspect-16/10 overflow-hidden border border-foreground/10 p-2 bg-white shadow-sm transform rotate-1 group-hover:rotate-0 transition-transform duration-500">
                                        <div className="relative w-full h-full overflow-hidden">
                                            <Image
                                                src={article.imageUrl}
                                                alt={article.title}
                                                fill
                                                className="object-cover grayscale-[0.8] contrast-125 group-hover:grayscale-0 transition-all duration-700"
                                                sizes="(max-width: 768px) 100vw, 400px"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-3 mt-2">
                                    <div className="flex flex-wrap gap-2">
                                        {article.tags.map((tag) => (
                                            <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-primary/70 border-r border-foreground/20 pr-2 last:border-0">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h4 className="text-2xl font-serif font-black tracking-tight text-foreground leading-tight group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground line-clamp-3 font-serif opacity-80 leading-relaxed italic text-justify">
                                        {article.excerpt}
                                    </p>
                                </div>
                            </div>
                        </Link>
                        <div className="pt-4 border-t border-dashed border-foreground/20 mt-6 flex justify-between items-center">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
                                <span>By {article.author}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CoffeeMeter time={article.readingTime} />
                                <BookmarkButton id={article.id} isBookmarked={isBookmarked} onToggle={onToggleBookmark} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const ThreeArticleLayout: React.FC<{
    articles: ArticleItem[];
    bookmarks: string[];
    onToggleBookmark: (id: string, e: React.MouseEvent) => void;
}> = ({ articles, bookmarks, onToggleBookmark }) => {
    const lead = articles[0];
    const sideArticles = articles.slice(1, 3);
    const leadBookmarked = bookmarks.includes(lead.id);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Lead Article (Left) */}
            <div className="lg:col-span-7 relative group border border-foreground/10 hover:border-foreground/30 p-5 sm:p-6 bg-card hover:bg-primary/2 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(78,52,46,0.04)] flex flex-col justify-between rounded-sm">
                <InkStamp text="Lead dispatch" className="top-6 right-6" />
                <Link href={`/blog/${lead.id}`} className="flex flex-col gap-6 h-full justify-between">
                    <div className="space-y-4">
                        {lead.imageUrl && (
                            <div className="relative w-full aspect-16/10 overflow-hidden border border-foreground/10 p-2.5 bg-white shadow-sm transform -rotate-1 group-hover:rotate-0 transition-transform duration-500">
                                <div className="relative w-full h-full overflow-hidden">
                                    <Image
                                        src={lead.imageUrl}
                                        alt={lead.title}
                                        fill
                                        className="object-cover grayscale-[0.8] contrast-125 group-hover:grayscale-0 transition-all duration-700"
                                        sizes="(max-width: 1024px) 100vw, 600px"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="space-y-3 mt-2">
                            <div className="flex flex-wrap gap-2">
                                {lead.tags.map((tag) => (
                                    <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-primary/70 border-r border-foreground/20 pr-2 last:border-0">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h4 className="text-3xl font-serif font-black tracking-tight text-foreground leading-[1.1] group-hover:text-primary transition-colors">
                                {lead.title}
                            </h4>
                            <p className="text-base text-foreground/90 font-serif opacity-90 leading-relaxed italic first-letter:float-left first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:text-primary first-letter:leading-none text-justify">
                                {lead.excerpt}
                            </p>
                        </div>
                    </div>
                </Link>
                <div className="pt-6 border-t border-double border-foreground/30 mt-6 flex justify-between items-center">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                        <span>By {lead.author}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CoffeeMeter time={lead.readingTime} />
                        <BookmarkButton id={lead.id} isBookmarked={leadBookmarked} onToggle={onToggleBookmark} />
                    </div>
                </div>
            </div>

            {/* Side Stack (Right) */}
            <div className="lg:col-span-5 lg:border-l lg:border-foreground/15 lg:pl-8 xl:pl-12 flex flex-col gap-8 justify-between">
                {sideArticles.map((article, idx) => {
                    const isBookmarked = bookmarks.includes(article.id);
                    return (
                        <div
                            key={article.id}
                            className={`relative group border border-foreground/10 hover:border-foreground/30 p-5 bg-card hover:bg-primary/2 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(78,52,46,0.04)] flex-1 flex flex-col justify-between rounded-sm ${
                                idx === 1 ? "mt-4" : ""
                            }`}
                        >
                            <Link href={`/blog/${article.id}`} className="flex flex-col gap-4 h-full justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[8px] font-mono opacity-50 uppercase tracking-widest">SUB-DISPATCH 0{idx + 1}</span>
                                        <span className="text-[9px] font-bold text-primary/80 uppercase tracking-wider">{article.tags[0]}</span>
                                    </div>
                                    <h5 className="text-xl font-serif font-black tracking-tight text-foreground leading-tight group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h5>
                                    <p className="text-xs text-muted-foreground line-clamp-2 font-serif opacity-80 leading-relaxed italic text-justify">
                                        {article.excerpt}
                                    </p>
                                </div>
                            </Link>
                            <div className="pt-4 border-t border-dashed border-foreground/20 flex justify-between items-center mt-4">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-foreground/40">
                                    <span>By {article.author}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CoffeeMeter time={article.readingTime} />
                                    <BookmarkButton id={article.id} isBookmarked={isBookmarked} onToggle={onToggleBookmark} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const FourArticleLayout: React.FC<{
    articles: ArticleItem[];
    bookmarks: string[];
    onToggleBookmark: (id: string, e: React.MouseEvent) => void;
}> = ({ articles, bookmarks, onToggleBookmark }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {articles.map((article, idx) => {
                const isBookmarked = bookmarks.includes(article.id);
                return (
                    <div
                        key={article.id}
                        className="relative group border border-foreground/10 hover:border-foreground/30 p-5 bg-card hover:bg-primary/2 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(78,52,46,0.04)] flex flex-col justify-between rounded-sm"
                    >
                        {idx === 0 && <InkStamp text="Editor's Pick" className="top-5 right-5" />}
                        <Link href={`/blog/${article.id}`} className="flex flex-col gap-4 h-full justify-between">
                            <div className="space-y-3">
                                {article.imageUrl && idx < 2 && (
                                    <div className="relative w-full aspect-16/10 overflow-hidden border border-foreground/10 p-1.5 bg-white shadow-sm transform rotate-1 group-hover:rotate-0 transition-transform duration-500">
                                        <div className="relative w-full h-full overflow-hidden">
                                            <Image
                                                src={article.imageUrl}
                                                alt={article.title}
                                                fill
                                                className="object-cover grayscale-[0.8] contrast-125 group-hover:grayscale-0 transition-all duration-700"
                                                sizes="(max-width: 768px) 100vw, 350px"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-1 mt-2">
                                    <span className="text-[9px] font-bold text-primary/80 uppercase tracking-wider">{article.tags[0]}</span>
                                    <h4 className="text-xl lg:text-2xl font-serif font-black tracking-tight text-foreground leading-tight group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h4>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 font-serif opacity-80 leading-relaxed italic text-justify">
                                    {article.excerpt}
                                </p>
                            </div>
                        </Link>
                        <div className="pt-4 border-t border-dotted border-foreground/20 mt-4 flex justify-between items-center">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
                                <span>By {article.author}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CoffeeMeter time={article.readingTime} />
                                <BookmarkButton id={article.id} isBookmarked={isBookmarked} onToggle={onToggleBookmark} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const LargeGazetteLayout: React.FC<{
    articles: ArticleItem[];
    bookmarks: string[];
    onToggleBookmark: (id: string, e: React.MouseEvent) => void;
}> = ({ articles, bookmarks, onToggleBookmark }) => {
    const lead = articles[0];
    const column2Articles = articles.slice(1, 3);
    const column3Articles = articles.slice(3);
    const leadBookmarked = bookmarks.includes(lead.id);

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            {/* Column 1: Lead (col-span-6) */}
            <div className="md:col-span-6 relative group border border-foreground/10 hover:border-foreground/30 p-5 sm:p-6 bg-card hover:bg-primary/2 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(78,52,46,0.04)] flex flex-col justify-between rounded-sm">
                <InkStamp text="Featured broadsheet" className="top-6 right-6" />
                <Link href={`/blog/${lead.id}`} className="flex flex-col gap-6 h-full justify-between">
                    <div className="space-y-4">
                        {lead.imageUrl && (
                            <div className="relative w-full aspect-16/10 overflow-hidden border border-foreground/10 p-2.5 bg-white shadow-sm transform -rotate-1 group-hover:rotate-0 transition-transform duration-500">
                                <div className="relative w-full h-full overflow-hidden">
                                    <Image
                                        src={lead.imageUrl}
                                        alt={lead.title}
                                        fill
                                        className="object-cover grayscale-[0.8] contrast-125 group-hover:grayscale-0 transition-all duration-700"
                                        sizes="(max-width: 768px) 100vw, 500px"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="space-y-3 mt-2">
                            <div className="flex flex-wrap gap-2">
                                {lead.tags.map((tag) => (
                                    <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-primary/70 border-r border-foreground/20 pr-2 last:border-0">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h4 className="text-3xl font-serif font-black tracking-tight text-foreground leading-tight group-hover:text-primary transition-colors">
                                {lead.title}
                            </h4>
                            <p className="text-base text-foreground/90 font-serif opacity-90 leading-relaxed italic first-letter:float-left first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:text-primary first-letter:leading-none text-justify">
                                {lead.excerpt}
                            </p>
                        </div>
                    </div>
                </Link>
                <div className="pt-6 border-t border-double border-foreground/30 mt-6 flex justify-between items-center">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                        <span>By {lead.author}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CoffeeMeter time={lead.readingTime} />
                        <BookmarkButton id={lead.id} isBookmarked={leadBookmarked} onToggle={onToggleBookmark} />
                    </div>
                </div>
            </div>

            {/* Column 2: Stack of 2 (col-span-3) */}
            <div className="md:col-span-3 flex flex-col gap-6 justify-between">
                {column2Articles.map((article, _idx) => {
                    const isBookmarked = bookmarks.includes(article.id);
                    return (
                        <div
                            key={article.id}
                            className="relative group border border-foreground/10 hover:border-foreground/30 p-5 bg-card hover:bg-primary/2 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(78,52,46,0.04)] flex-1 flex flex-col justify-between rounded-sm"
                        >
                            <Link href={`/blog/${article.id}`} className="flex flex-col gap-3 h-full justify-between">
                                <div className="space-y-2">
                                    <span className="text-[9px] font-bold text-primary/80 uppercase tracking-wider">{article.tags[0]}</span>
                                    <h5 className="text-lg font-serif font-black tracking-tight text-foreground leading-tight group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h5>
                                    <p className="text-xs text-muted-foreground line-clamp-4 font-serif opacity-80 leading-relaxed italic text-justify">
                                        {article.excerpt}
                                    </p>
                                </div>
                            </Link>
                            <div className="pt-4 flex justify-between items-center mt-4 border-t border-dashed border-foreground/20">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-foreground/40">
                                    <span>By {article.author}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CoffeeMeter time={article.readingTime} />
                                    <BookmarkButton id={article.id} isBookmarked={isBookmarked} onToggle={onToggleBookmark} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Column 3: Stack of remaining (col-span-3) */}
            <div className="md:col-span-3 border border-foreground/10 p-5 bg-card flex flex-col gap-6 rounded-sm shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-45 pb-2 border-b-2 border-foreground/20">Brief Updates</span>
                {column3Articles.map((article) => {
                    const isBookmarked = bookmarks.includes(article.id);
                    return (
                        <div key={article.id} className="border-b border-foreground/10 pb-4 last:border-0 relative group">
                            <Link href={`/blog/${article.id}`} className="flex flex-col gap-2">
                                <span className="text-[9px] font-mono opacity-50 uppercase">{article.date}</span>
                                <h5 className="text-sm font-serif font-black tracking-tight text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                    {article.title}
                                </h5>
                                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-foreground/50 mt-1">
                                    <span>By {article.author}</span>
                                    <BookmarkButton id={article.id} isBookmarked={isBookmarked} onToggle={onToggleBookmark} />
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const ArticleItemList: React.FC<Props> = ({category, articles}) => {
    const [bookmarks, setBookmarks] = React.useState<string[]>([]);

    React.useEffect(() => {
        const stored = localStorage.getItem("mindcanvas_bookmarks");
        if (stored) {
            try {
                setBookmarks(JSON.parse(stored));
            } catch (e) {}
        }
    }, []);

    const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const updated = bookmarks.includes(id)
            ? bookmarks.filter(b => b !== id)
            : [...bookmarks, id];
        setBookmarks(updated);
        localStorage.setItem("mindcanvas_bookmarks", JSON.stringify(updated));
    };

    const renderContent = () => {
        if (articles.length === 0) {
            return (
                <div className="py-8 text-center text-muted-foreground italic border border-dashed border-foreground/20">
                    <p className="text-xs uppercase tracking-widest">Section Currently Empty</p>
                </div>
            );
        }

        switch (articles.length) {
            case 1:
                return <SingleColumnLayout article={articles[0]} bookmarks={bookmarks} onToggleBookmark={handleToggleBookmark} />;
            case 2:
                return <TwoColumnLayout articles={articles} bookmarks={bookmarks} onToggleBookmark={handleToggleBookmark} />;
            case 3:
                return <ThreeArticleLayout articles={articles} bookmarks={bookmarks} onToggleBookmark={handleToggleBookmark} />;
            case 4:
                return <FourArticleLayout articles={articles} bookmarks={bookmarks} onToggleBookmark={handleToggleBookmark} />;
            default:
                return <LargeGazetteLayout articles={articles} bookmarks={bookmarks} onToggleBookmark={handleToggleBookmark} />;
        }
    };

    return (
        <Card className="rounded-none border-none bg-transparent shadow-none w-full h-full flex flex-col justify-between">
            <div className="w-full">
                <CardHeader className="px-0 pt-0 pb-4 mb-6 border-b-2 border-foreground relative">
                    <h3 className="text-3xl md:text-4xl font-serif font-black tracking-tighter text-foreground uppercase italic">
                        {category}
                    </h3>
                    <div className="absolute -bottom-0.5 left-0 w-12 h-0.5 bg-primary" />
                </CardHeader>

                <CardContent className="px-0 py-0">
                    {renderContent()}
                </CardContent>
            </div>
        </Card>
    );
};