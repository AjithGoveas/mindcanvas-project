import Link from "next/link";
import {ArrowLeftIcon} from "@heroicons/react/24/solid";
import {getArticleData} from "@/lib/articles";

const Article = async ({params}: { params: Promise<{ slug: string }> }) => {
    const {slug} = await params;
    const articleData = await getArticleData(slug);

    return (
        <section className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-20 py-20">
            {/* Navigation */}
            <div
                className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-muted-foreground font-sans text-sm">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition"
                >
                    <ArrowLeftIcon width={18}/>
                    <span>Back to Home</span>
                </Link>
                <time className="text-xs sm:text-sm">{articleData.date.toString()}</time>
            </div>

            {/* Article Content */}
            <article
                className="article max-w-3xl mx-auto"
                dangerouslySetInnerHTML={{__html: articleData.contentHtml}}
            />

            {/* Author Signature */}
            <footer
                className="mt-16 mb-24 max-w-xl mx-auto bg-muted/40 border border-border rounded-xl shadow-sm px-6 py-5 text-center">
                <p className="text-sm font-medium text-muted-foreground mb-1">Written by</p>
                <p className="text-xl font-serif font-bold text-foreground">{articleData.author}</p>
            </footer>
        </section>
    );
};

export default Article;