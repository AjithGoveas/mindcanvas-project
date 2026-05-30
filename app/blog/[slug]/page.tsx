import {Metadata} from "next";
import {notFound} from "next/navigation";
import {getArticleData, getSortedArticles} from "@/lib/articles";
import {ArticleContent} from "@/components/ArticleContent";

export async function generateMetadata(
    {params}: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const {slug} = await params;
    try {
        const article = await getArticleData(slug);
        return {
            title: article.title,
            description: article.excerpt,
            openGraph: {
                title: article.title,
                description: article.excerpt,
                type: "article",
                publishedTime: article.date,
                authors: [article.author],
                images: article.imageUrl ? [{url: article.imageUrl}] : [],
            },
            twitter: {
                card: "summary_large_image",
                title: article.title,
                description: article.excerpt,
                images: article.imageUrl ? [article.imageUrl] : [],
            },
        };
    } catch (e) {
        return {
            title: "Article Not Found",
        };
    }
}

const Article = async ({params}: { params: Promise<{ slug: string }> }) => {
    const {slug} = await params;
    let articleData;
    
    try {
        articleData = await getArticleData(slug);
    } catch (e) {
        notFound();
    }

    // Retrieve all sorted articles to find related readings
    const allArticles = getSortedArticles();
    const relatedArticles = allArticles
        .filter((article) => article.id !== slug)
        .filter((article) => article.category === articleData.category)
        .slice(0, 3);
        
    // If we have fewer than 3 related articles, grab other recent ones to fill
    if (relatedArticles.length < 3) {
        const excludedIds = new Set([slug, ...relatedArticles.map((a) => a.id)]);
        const fillers = allArticles
            .filter((article) => !excludedIds.has(article.id))
            .slice(0, 3 - relatedArticles.length);
        relatedArticles.push(...fillers);
    }

    return <ArticleContent articleData={articleData} relatedArticles={relatedArticles} />;
};

export default Article;