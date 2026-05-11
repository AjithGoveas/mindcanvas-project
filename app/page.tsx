import {getSortedArticles, getCategorizedArticles} from "@/lib/articles";
import {ArticleItemList} from "@/components/ArticleListItem";
import {Search} from "@/components/Search";
import {ModeToggle} from "@/components/toggle-theme";

export default function Home() {
    const allArticles = getSortedArticles();
    
    // Categorize articles once to avoid redundant disk reads
    const categorizedArticles = allArticles.reduce((acc, article) => {
        if (!acc[article.category]) {
            acc[article.category] = [];
        }
        acc[article.category].push(article);
        return acc;
    }, {} as Record<string, typeof allArticles>);

    return (
        <main className="min-h-screen bg-background pb-32">
            {/* NEWSPAPER MASTHEAD */}
            <header className="container mx-auto px-6 pt-16 pb-12 border-b-4 border-double border-foreground/30 text-center relative">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.4em] opacity-60 mb-8 border-b border-foreground/10 pb-4">
                    <span>The Premier Thought Dispatch</span>
                    <div className="hidden md:flex items-center gap-4">
                        <span>Volume I</span>
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <span>Edition 42</span>
                    </div>
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <div className="flex items-center gap-4 ml-4">
                        <div className="w-px h-3 bg-foreground/20 hidden sm:block" />
                        <ModeToggle />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                    <h1 className="font-serif text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter text-foreground leading-none">
                        MindCanvas
                    </h1>
                    <div className="w-full max-w-sm h-px bg-foreground/20" />
                    <p className="max-w-3xl text-lg md:text-2xl text-muted-foreground font-serif italic leading-tight opacity-80">
                        Reporting on the intersections of <span className="text-primary">Human Experience</span>, <span className="text-primary">Digital Evolution</span>, and the <span className="text-primary">Creative Mind</span>.
                    </p>
                </div>

                <div className="mt-12 flex justify-center">
                    <Search articles={allArticles} />
                </div>
            </header>

            {/* FRONT PAGE GRID */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content Area */}
                    <div className="lg:col-span-12">
                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
                            {categorizedArticles &&
                                Object.entries(categorizedArticles).map(([category, articles]) => (
                                    <ArticleItemList
                                        key={category}
                                        category={category}
                                        articles={articles}
                                    />
                                ))}
                        </section>
                    </div>
                </div>
            </div>

            {/* FOOTER ADVERTISEMENT / SIGNATURE */}
            <footer className="container mx-auto px-6 mt-20 text-center border-t border-foreground/10 pt-12">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">
                    Est. 2025 — Circulating Worldwide — 5 Cents
                </p>
            </footer>
        </main>
    );
}