"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArticleItem } from "@/types";
import { ArticleItemList } from "./ArticleListItem";

const InkStamp = ({ text, className = "" }: { text: string; className?: string }) => (
  <div className={`absolute select-none pointer-events-none border-2 border-dashed px-2.5 py-0.5 font-mono text-[9px] font-black tracking-widest uppercase rounded-sm border-primary/25 text-primary/35 -rotate-6 transform ${className}`}>
    {text}
  </div>
);

const PressAdvertisement = () => (
  <div className="lg:col-span-4 bg-card border border-foreground/15 border-t-4 border-t-foreground/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between rounded-sm relative overflow-hidden">
    <InkStamp text="HOUSE PRESS" className="top-4 right-4" />
    <div className="space-y-6">
      <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest block border-b border-foreground/15 pb-2">MIND CANVAS ADVERTISERS</span>
      <div className="space-y-4 text-center my-6">
        <span className="text-4xl text-primary font-black font-serif italic select-none">Coffee & Ink</span>
        <p className="text-xs text-muted-foreground font-serif leading-relaxed italic px-2">
          "The perfect companions for reflective thoughts and modular compiles. Crafted by hand, distributed worldwide since 2025."
        </p>
      </div>
      <div className="pt-4 border-t border-dashed border-foreground/20 text-center space-y-2">
        <p className="text-[10px] font-mono uppercase tracking-widest opacity-60">VISIT THE CAFE DECK</p>
        <p className="text-[11px] text-foreground/75 font-serif leading-relaxed">
          Enjoy organic roasts, local dispatches, and quiet workspaces at our physical locations.
        </p>
      </div>
    </div>
    <div className="mt-8 pt-4 border-t border-double border-foreground/30 text-center text-[8px] font-mono opacity-30 uppercase tracking-widest">
      OPERATED INDEPENDENTLY
    </div>
  </div>
);

const PressQuoteCard = () => (
  <div className="lg:col-span-4 bg-card border border-foreground/15 border-t-4 border-t-foreground/85 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between rounded-sm relative overflow-hidden">
    <InkStamp text="Wax Seal Approved" className="top-4 right-4" />
    <div className="space-y-6">
      <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest block border-b border-foreground/15 pb-2">THE READER'S CORNER</span>
      <div className="space-y-4 font-serif leading-relaxed italic text-justify py-4 text-foreground/80">
        <p className="text-xs">
          "Reading is not just the consumption of information; it is the conversation between two minds across space and time. Take your time, breathe the aroma of your brew, and digest the words slowly."
        </p>
        <p className="text-[10px] font-bold text-foreground/50 text-right uppercase tracking-wider">— Marcus Aurelius (Adapted)</p>
      </div>
    </div>
    <div className="mt-8 pt-4 border-t border-double border-foreground/30 text-center text-[8px] font-mono opacity-30 uppercase tracking-widest">
      CIRCULATING WORLDWIDE
    </div>
  </div>
);

interface ArchiveFeedProps {
  articles: ArticleItem[];
}

export const ArchiveFeed: React.FC<ArchiveFeedProps> = ({ articles }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const isInitialRender = useRef(true);

  // Categories list extracted from all articles
  const categories = Array.from(new Set(articles.map((a) => a.category)));

  // Categorize all articles (including the lead story) efficiently
  const categorizedArticles = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, typeof articles>);

  const categorizedEntries = Object.entries(categorizedArticles);

  // Filter categories dynamically based on selected index category
  const filteredEntries = selectedCategory === "all"
    ? categorizedEntries
    : categorizedEntries.filter(([category]) => category === selectedCategory);

  // Sort categorized entries:
  // 1. Primary: col-span descending (12 -> 8 -> 4)
  // 2. Secondary: latest article dateTimestamp descending (latest first)
  const sortedFilteredEntries = [...filteredEntries].sort((a, b) => {
    const spanA = a[1].length === 1 ? 4 : a[1].length === 2 ? 8 : 12;
    const spanB = b[1].length === 1 ? 4 : b[1].length === 2 ? 8 : 12;

    if (spanA !== spanB) {
      return spanB - spanA; // Descending span (12 first, then 8, then 4)
    }

    const timeA = Math.max(...a[1].map((art) => art.dateTimestamp || 0));
    const timeB = Math.max(...b[1].map((art) => art.dateTimestamp || 0));

    return timeB - timeA; // Descending timestamp (latest date first)
  });

  // Handle scrolling when selectedCategory changes (except for initial render)
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const element = document.getElementById("archive-feed");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedCategory]);

  return (
    <div>
      {/* 2. ARCHIVE INDEX FEED WITH INTERACTIVE FILTERS */}
      <div id="archive-feed" className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-foreground/20 pb-6 mt-20 select-none scroll-mt-6">
        <div className="space-y-1 text-left">
          <span className="text-sm font-black uppercase tracking-[0.2em] text-foreground block">
            Classified Indexes & Dispatches
          </span>
          <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest block">
            TOTAL DISPATCHES: {articles.length} // ARCHIVE STATUS: OPERATIONAL // REVISION: MAY 2026
          </span>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1 font-mono text-[9px] uppercase tracking-wider border transition-all ${
              selectedCategory === "all"
                ? "bg-foreground text-background border-foreground font-bold"
                : "border-foreground/20 hover:border-foreground hover:bg-foreground/5 text-foreground/75"
            }`}
          >
            All Dispatches
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 font-mono text-[9px] uppercase tracking-wider border transition-all ${
                selectedCategory === cat
                  ? "bg-foreground text-background border-foreground font-bold"
                  : "border-foreground/20 hover:border-foreground hover:bg-foreground/5 text-foreground/75"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch animate-in fade-in duration-300">
        {sortedFilteredEntries.map(([category, catArticles], index) => {
          // Determine grid column span based on the number of articles:
          // - 1 article: lg:col-span-4 (1/3 row)
          // - 2 articles: lg:col-span-8 (2/3 row)
          // - 3+ articles: lg:col-span-12 (full row)
          let colSpanClass = "lg:col-span-12";
          if (catArticles.length === 1) {
            colSpanClass = "lg:col-span-4";
          } else if (catArticles.length === 2) {
            colSpanClass = "lg:col-span-8";
          }

          return (
            <div
              key={category}
              className={`${colSpanClass} bg-card border border-foreground/15 border-t-4 border-t-foreground/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between rounded-sm`}
            >
              <div className="w-full">
                <ArticleItemList
                  category={category}
                  articles={catArticles}
                />
              </div>
              <div className="mt-8 pt-4 border-t border-dashed border-foreground/20 flex justify-between items-center text-[10px] font-mono opacity-50 uppercase tracking-widest">
                <span>Archive Vault // Sec. 0{index + 1}</span>
                <span>{catArticles.length} {catArticles.length === 1 ? "dispatch" : "dispatches"}</span>
              </div>
            </div>
          );
        })}

        {/* Mathematically balance remaining columns to always complete grid rows to exactly 12 */}
        {(() => {
          const totalSpans = sortedFilteredEntries.reduce(
            (sum, [_, catArticles]) => sum + (catArticles.length === 1 ? 4 : catArticles.length === 2 ? 8 : 12),
            0
          );
          const remainingSpans = (12 - (totalSpans % 12)) % 12;

          if (remainingSpans === 4) {
            return <PressAdvertisement />;
          } else if (remainingSpans === 8) {
            return (
              <>
                <PressAdvertisement />
                <PressQuoteCard />
              </>
            );
          }
          return null;
        })()}
      </section>
    </div>
  );
};
