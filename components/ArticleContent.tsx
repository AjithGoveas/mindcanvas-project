"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {IconArrowLeft, IconPrinter, IconShare} from "@tabler/icons-react";
import {ArticleItem} from "@/types";
import {ModeToggle} from "@/components/toggle-theme";
import {ReadingProgressBar} from "@/components/ReadingProgressBar";

interface Props {
    articleData: ArticleItem;
}

export const ArticleContent: React.FC<Props> = ({articleData}) => {
    const [copied, setCopied] = React.useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-background relative overflow-x-hidden">
            <ReadingProgressBar/>

            {/* Top Gazette Bar */}
            <nav className="w-full border-b border-foreground/20 bg-background/80 backdrop-blur-md sticky top-0 z-90">
                <div className="container mx-auto px-6 py-3 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-3 text-xs font-black uppercase tracking-tighter text-foreground group"
                    >
                        <IconArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform"/>
                        <span>The MindCanvas Gazette</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.print()}
                            className="hidden sm:flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <IconPrinter size={12}/> Print Edition
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors"
                        >
                            <IconShare size={14}/> {copied ? "Copied!" : "Dispatch"}
                        </button>
                        <div className="w-px h-3 bg-foreground/20 hidden sm:block"/>
                        <ModeToggle/>
                    </div>
                </div>
            </nav>

            <main className="animate-in fade-in duration-1000">
                {/* THE BROADSHET MASTHEAD */}
                <header className="container mx-auto max-w-7xl px-6 pt-12 pb-8">
                    {/* Vol & Date Info */}
                    <div
                        className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.4em] border-b-2 border-foreground pb-2 mb-10">
                        <span>Vol. I — No. 42</span>
                        <span className="hidden md:block">Reporting on the Nuances of Experience</span>
                        <span>{articleData.date}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* Title & Lead Story (7 cols) */}
                        <div className="lg:col-span-7 flex flex-col gap-8">
                            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[0.95]">
                                {articleData.title}
                            </h1>

                            {articleData.excerpt && (
                                <div className="relative border-l-4 border-primary pl-6 py-2 my-2">
                                    <span
                                        className="block text-[8px] font-black uppercase tracking-[0.3em] text-primary mb-2 opacity-60">Abstract</span>
                                    <p className="text-lg md:text-xl font-serif italic text-foreground/80 leading-[1.4] tracking-tight">
                                        {articleData.excerpt}
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <span
                                    className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Authors</span>
                                <h2 className="text-2xl font-serif font-black uppercase tracking-widest">
                                    {articleData.author}
                                </h2>
                            </div>
                        </div>

                        {/* Integrated Lead Photograph (5 cols) */}
                        <div className="lg:col-span-5 flex flex-col gap-4">
                            {articleData.imageUrl ? (
                                <figure className="relative">
                                    <div
                                        className="relative aspect-4/5 w-full border border-foreground/10 p-2 bg-white shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-700 overflow-hidden group">
                                        <Image
                                            src={articleData.imageUrl}
                                            alt={articleData.title}
                                            fill
                                            className="object-cover grayscale-[0.9] contrast-125 group-hover:grayscale-0 transition-all duration-[2s] group-hover:scale-105"
                                            priority
                                            sizes="(max-width: 768px) 100vw, 40vw"
                                        />
                                        <div
                                            className="absolute top-4 right-4 bg-black/80 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1">
                                            Field Plate
                                        </div>
                                    </div>
                                    <figcaption
                                        className="mt-4 text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 leading-relaxed">
                                        Observed in the {articleData.category} archives. This dispatch covers the
                                        primary findings regarding the {articleData.title.toLowerCase()}.
                                    </figcaption>
                                </figure>
                            ) : (
                                <div
                                    className="h-full flex flex-col justify-center border-l-2 border-foreground/10 pl-10 py-20 italic text-muted-foreground/40">
                                    <p className="text-sm tracking-[0.3em] uppercase">No Visual Archives Available</p>
                                </div>
                            )}

                            <div className="mt-6 space-y-4 border-t border-foreground/10 pt-6">
                                <div
                                    className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                    <span className="opacity-40">Classification</span>
                                    <span>{articleData.category}</span>
                                </div>
                                <div
                                    className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                    <span className="opacity-40">Reading Duration</span>
                                    <span>{articleData.readingTime} Minutes</span>
                                </div>
                                <button
                                    onClick={handleShare}
                                    className="w-full py-4 border border-foreground/20 text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all flex items-center justify-center gap-2 mt-4"
                                >
                                    <IconShare size={12}/> {copied ? "Link Copied to Clipboard" : "Dispatch this Piece"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Final Rule Line */}
                    <div className="w-full border-t-4 border-double border-foreground/30 mt-16"/>
                </header>

                {/* THE GAZETTE CONTENT */}
                <article
                    className="article"
                    dangerouslySetInnerHTML={{__html: articleData.contentHtml}}
                />

                {/* GAZETTE FOOTER */}
                <footer
                    className="container mx-auto max-w-4xl px-6 py-24 mt-20 border-t-4 border-double border-foreground/30 text-center">
                    <div className="flex flex-col gap-12">
                        <div className="space-y-4">
                            <h3 className="text-4xl font-serif font-black tracking-tighter italic">About the
                                Author</h3>
                            <p className="text-lg text-muted-foreground font-serif leading-relaxed max-w-xl mx-auto opacity-80">
                                {articleData.author} is a lead observer for the MindCanvas Gazette, reporting on the
                                nuances of human experience and technological evolution.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link
                                href="/"
                                className="px-12 py-5 bg-foreground text-background font-black uppercase tracking-widest text-xs hover:bg-primary transition-colors shadow-xl"
                            >
                                Return to Front Page
                            </Link>
                            <button
                                className="px-12 py-5 border-2 border-foreground/20 font-black uppercase tracking-widest text-xs hover:border-foreground transition-colors">
                                Subscribe to Feed
                            </button>
                        </div>

                        <div className="mt-12 text-[10px] font-bold uppercase tracking-[0.5em] opacity-30">
                            © 2025 MindCanvas Gazette — All Truths Reserved
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};
