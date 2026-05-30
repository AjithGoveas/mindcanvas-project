import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getSortedArticles } from "@/lib/articles";
import { Search } from "@/components/Search";
import { ModeToggle } from "@/components/toggle-theme";
import { ArchiveFeed } from "@/components/ArchiveFeed";

const InkStamp = ({ text, className = "" }: { text: string; className?: string }) => (
    <div className={`select-none pointer-events-none border-2 border-dashed px-2.5 py-0.5 font-mono text-[9px] font-black tracking-widest uppercase rounded-sm border-primary/25 text-primary/35 -rotate-6 transform ${className}`}>
        {text}
    </div>
);

export default async function Home() {
    const allArticles = getSortedArticles();

    // Pull the absolute latest dispatch to act as the primary front-page lead story
    const leadArticle = allArticles[0];

    // Find the highest available issue number dynamically
    const dynamicIssueNumber = allArticles.reduce((max, article) => {
        const currentIssue = Number(article.issueNumber) || 1;
        return currentIssue > max ? currentIssue : max;
    }, 1);

    const formattedDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <main className="min-h-screen bg-background pb-32">
            {/* THE MASTHEAD: Clean, Authoritative, Minimalist */}
            <header className="container mx-auto px-6 pt-12 pb-6 text-center relative select-none">
                {/* Meta Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] font-bold uppercase tracking-widest opacity-80 mb-8 border-y-4 border-double border-foreground py-2.5 gap-4">
                    <span className="hidden sm:block">The Premier Thought Dispatch</span>
                    <div className="flex items-center gap-3">
                        <span className="bg-foreground text-background px-3 py-1 text-[10px]">Dispatch Issue No. {dynamicIssueNumber}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="font-serif italic text-xs tracking-tight text-foreground">{formattedDate}</span>
                        <div className="w-px h-3 bg-foreground/40 hidden sm:block" />
                        <ModeToggle />
                    </div>
                </div>

                {/* The Title */}
                <div className="flex flex-col items-center gap-6 my-12">
                    <h1 className="font-serif text-6xl sm:text-8xl md:text-[8.5rem] font-black tracking-tighter text-foreground leading-[0.85] uppercase select-none">
                        MindCanvas
                    </h1>
                    <div className="w-full max-w-2xl h-px bg-foreground/20" />
                    <p className="max-w-2xl text-lg md:text-xl text-foreground/70 font-serif italic leading-relaxed px-4">
                        Reporting on the complex intersections of <span className="text-primary font-semibold">Human Experience</span>, <span className="text-primary font-semibold">Digital Evolution</span>, and the <span className="text-primary font-semibold">Creative Mind</span>.
                    </p>
                </div>

                <div className="mt-8 flex justify-center w-full max-w-lg mx-auto px-4">
                    <Search articles={allArticles} />
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                {/* 1. EDITORIAL HERO BLOCK (Asymmetric 3-Column Layout) */}
                {leadArticle && (
                    <section className="border-b-2 border-foreground pb-12 mb-16 select-none md:select-text">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                            {/* Left Column: Trending Topics (col-span-3) */}
                            <div className="lg:col-span-3 border border-foreground/10 p-6 bg-card rounded-sm relative flex flex-col justify-between h-full shadow-xs">
                                <InkStamp text="Index Spotlight" className="top-4 right-4" />
                                <div className="space-y-6">
                                    <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest block border-b border-foreground/15 pb-2">TRENDING TOPICS</span>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <h5 className="font-serif font-black text-sm uppercase text-primary tracking-tight">System Architecture</h5>
                                            <p className="text-[11px] text-muted-foreground font-serif leading-relaxed italic text-justify">
                                                Exploring deep-compute caching, local LLM configurations, and low-latency API gateways.
                                            </p>
                                        </div>
                                        <div className="space-y-1 pt-3 border-t border-dashed border-foreground/20">
                                            <h5 className="font-serif font-black text-sm uppercase text-primary tracking-tight">Mobile Engineering</h5>
                                            <p className="text-[11px] text-muted-foreground font-serif leading-relaxed italic text-justify">
                                                Analyzing state recomposition, modular Kotlin architectures, and native platforms integration.
                                            </p>
                                        </div>
                                        <div className="space-y-1 pt-3 border-t border-dashed border-foreground/20">
                                            <h5 className="font-serif font-black text-sm uppercase text-primary tracking-tight">Ethical Living</h5>
                                            <p className="text-[11px] text-muted-foreground font-serif leading-relaxed italic text-justify">
                                                Applying philosophical guidelines, Stoic principles, and universal human values to modern work life.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-4 border-t border-double border-foreground/30 flex items-center justify-between text-[9px] font-mono opacity-40 uppercase tracking-widest">
                                    <span>SECTIONS: 01 // 04</span>
                                    <span>INDEXED DAILY</span>
                                </div>
                            </div>

                            {/* Center Column: Today's Lead Story (col-span-6) */}
                            <div className="lg:col-span-6 flex flex-col gap-6 text-left">
                                <div className="flex gap-3 items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20 px-3 py-1">
                                        {leadArticle.category}
                                    </span>
                                    {leadArticle.issueNumber && (
                                        <span className="text-[10px] font-mono opacity-60 uppercase tracking-widest">
                                            Issue #{leadArticle.issueNumber}
                                        </span>
                                    )}
                                </div>
                                <Link href={`/blog/${leadArticle.id}`} className="group">
                                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-foreground group-hover:text-primary transition-colors leading-[1.05] tracking-tight">
                                        {leadArticle.title}
                                    </h2>
                                </Link>

                                {leadArticle.imageUrl && (
                                    <div className="w-full group my-2">
                                        <Link href={`/blog/${leadArticle.id}`}>
                                            <div className="relative w-full aspect-16/10 overflow-hidden border border-foreground/10 p-2 bg-white shadow-sm transform -rotate-1 group-hover:rotate-0 transition-transform duration-500">
                                                <div className="relative w-full h-full overflow-hidden">
                                                    <Image
                                                        src={leadArticle.imageUrl}
                                                        alt={leadArticle.title}
                                                        fill
                                                        className="object-cover grayscale-[0.8] contrast-125 group-hover:grayscale-0 transition-all duration-700"
                                                        priority
                                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                                    />
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )}

                                <div className="columns-1 sm:columns-2 gap-6 text-justify text-sm text-foreground/80 font-serif leading-relaxed mt-2 [column-fill:balance] first-letter:float-left first-letter:text-6xl first-letter:font-black first-letter:mr-3 first-letter:text-primary first-letter:leading-none">
                                    {leadArticle.excerpt || "No summary provided by the special correspondent."}
                                </div>

                                <div className="pt-4 border-t border-double border-foreground/30 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-foreground/50 mt-4">
                                    <span>By {leadArticle.author}</span>
                                    <Link href={`/blog/${leadArticle.id}`} className="text-primary hover:underline font-bold uppercase tracking-wider text-[10px]">
                                        Continue Reading →
                                    </Link>
                                </div>
                            </div>

                            {/* Right Column: Editor's Note & Bulletin (col-span-3) */}
                            <div className="lg:col-span-3 border border-foreground/10 p-6 bg-card rounded-sm relative flex flex-col justify-between h-full shadow-xs">
                                <div className="space-y-6">
                                    <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest block border-b border-foreground/15 pb-2">EDITORIAL NOTE</span>
                                    <div className="space-y-3 font-serif">
                                        <p className="text-xs text-foreground/90 leading-relaxed italic text-justify">
                                            "Technology moves at an exponential pace, yet our minds still thrive on slow, intentional rituals. In this issue, we seek a thoughtful pause: merging the modern challenges of AI and Coroutines with the quiet, structural solidity of classic print layouts. We hope you bookmark your favorite dispatches and return to them in quiet hours."
                                        </p>
                                        <p className="text-[11px] font-bold text-foreground/60 text-right uppercase tracking-wider">— The Editor</p>
                                    </div>
                                    <div className="pt-4 border-t border-dashed border-foreground/20 space-y-4">
                                        <span className="text-[10px] font-mono opacity-50 uppercase block tracking-wider pb-1 border-b border-foreground/10">BULLETIN BOARD</span>
                                        <div className="space-y-3 text-[11px] font-serif leading-snug">
                                            <div className="border-b border-foreground/5 pb-2">
                                                <p className="font-bold text-primary uppercase text-[9px] tracking-wider">ISSUE NO. 3 LIVE</p>
                                                <p className="text-foreground/75 italic">JetBrains default template analysis is published. Check the Mobile Development column below.</p>
                                            </div>
                                            <div>
                                                <p className="font-bold text-primary uppercase text-[9px] tracking-wider">BOOKMARK TOOL IS LIVE</p>
                                                <p className="text-foreground/75 italic">You can now persist dispatches client-side using the star buttons in the archive index cards.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-4 border-t border-double border-foreground/30 text-center text-[8px] font-mono opacity-30 uppercase tracking-widest">
                                    MINDCANVAS CHRONICLE © 2026
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* 2. ARCHIVE INDEX FEED WITH INTERACTIVE FILTERS */}
                <ArchiveFeed articles={allArticles} />
            </div>

            {/* GAZETTE SIGNATURE FOOTER */}
            <footer className="container mx-auto px-6 mt-32 text-center">
                <div className="w-1/3 mx-auto flex items-center justify-center gap-4 mb-8">
                    <div className="h-px bg-foreground/30 flex-1" />
                    <div className="h-2 w-2 rotate-45 bg-foreground/20" />
                    <div className="h-px bg-foreground/30 flex-1" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/60">
                    Printed by the MindCanvas Press
                </p>
                <p className="text-[9px] font-mono uppercase tracking-widest opacity-40 mt-4">
                    Est. 2025 — Circulating Worldwide
                </p>
            </footer>
        </main>
    );
}