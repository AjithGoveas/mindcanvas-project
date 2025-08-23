import {getCategorizedArticles} from "@/lib/articles";
import {ArticleItemList} from "@/components/ArticleListItem";

export default function Home() {
    const categorizedArticles = getCategorizedArticles();

    return (
        <main className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-20 py-20">
            <header className="flex flex-col items-center text-center gap-6 mb-24">
                <h1 className="font-serif text-6xl md:text-7xl font-bold tracking-tight text-foreground">
                    MindCanvas
                </h1>
                <p className="max-w-2xl text-lg md:text-xl text-muted-foreground font-sans leading-relaxed">
                    Explore a curated collection of articles across diverse topics. Discover insights, knowledge, and
                    inspiration in every canvas.
                </p>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                {categorizedArticles &&
                    Object.entries(categorizedArticles).map(([category, articles]) => (
                        <ArticleItemList
                            key={category}
                            category={category}
                            articles={articles}
                        />
                    ))}
            </section>
        </main>
    );
}