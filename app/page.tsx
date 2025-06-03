import { getCategorizedArticles } from "@/lib/articles";
import ArticleItemList from "@/components/ArticleListItem";

export default function Home() {
    const categorizedArticles = getCategorizedArticles();

    console.log(categorizedArticles);

    return (
        <section className="mx-auto w-11/12 md:w-3/5 mt-16 flex flex-col gap-20 mb-24
                           bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
            {/* Header with refined typography and spacing */}
            <header className="font-cormorant font-medium text-6xl text-neutral-900 dark:text-neutral-100 text-center tracking-tight">
                <h1>MindCanvas</h1>
            </header>

            {/* Article section with better grid layout and spacing */}
            <section className="md:grid md:grid-cols-2 flex flex-col gap-12">
                {categorizedArticles &&
                    Object.keys(categorizedArticles).map((category) => (
                        <ArticleItemList
                            category={category}
                            articles={categorizedArticles[category]}
                            key={category}
                        />
                    ))
                }
            </section>
        </section>
    );
}