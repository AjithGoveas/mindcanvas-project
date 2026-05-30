"use client";

import React, { useState, useEffect, useRef } from "react";
import {IconSearch, IconX, IconFileText, IconCalendar, IconTag, IconCommand} from "@tabler/icons-react";
import { ArticleItem } from "@/types";
import { useRouter } from "next/navigation";

interface Props {
  articles: ArticleItem[];
}

export const Search: React.FC<Props> = ({ articles }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ArticleItem[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const filtered = articles.filter((article) =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.category.toLowerCase().includes(query.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())) ||
      article.excerpt.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered.slice(0, 5));
  }, [query, articles]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSelect = (id: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/${id}`);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground bg-muted/50 hover:bg-muted border border-border rounded-full transition-all group w-48 md:w-64"
      >
        <IconSearch size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="flex-1 text-left">Search articles...</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <IconCommand size={10} />K
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all animate-in fade-in duration-200">
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 sm:pt-40">
            <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center px-4 py-3 border-b border-border">
                <IconSearch className="text-muted-foreground mr-3" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search articles, tags, or categories..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground text-lg placeholder:text-muted-foreground py-2"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-muted rounded-md transition-colors"
                >
                  <IconX size={20} className="text-muted-foreground" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {query.trim() !== "" ? (
                  results.length > 0 ? (
                    <div className="p-2">
                      <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Results
                      </p>
                      {results.map((article) => (
                        <button
                          key={article.id}
                          onClick={() => handleSelect(article.id)}
                          className="w-full flex items-start gap-4 p-3 hover:bg-muted rounded-xl text-left transition-colors group"
                        >
                          <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <IconFileText size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif font-bold text-foreground truncate">
                              {article.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded">
                                <IconTag size={10} />
                                {article.category}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <IconCalendar size={10} />
                                {article.date}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="inline-flex p-4 bg-muted rounded-full mb-4">
                        <IconSearch size={32} className="text-muted-foreground/50" />
                      </div>
                      <p className="text-muted-foreground">
                        No articles found for "<span className="text-foreground font-medium">{query}</span>"
                      </p>
                    </div>
                  )
                ) : (
                  <div className="p-12 text-center text-muted-foreground">
                    <p>Start typing to search for articles...</p>
                  </div>
                )}
              </div>

              <div className="px-4 py-3 bg-muted/30 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
                <div className="flex gap-4">
                  <span><kbd className="border bg-muted px-1 rounded">esc</kbd> to close</span>
                  <span><kbd className="border bg-muted px-1 rounded">enter</kbd> to select</span>
                </div>
                <div>
                  Search powered by <span className="text-foreground font-medium">MindCanvas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
