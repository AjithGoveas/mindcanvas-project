import {Metadata} from "next";
import {notFound} from "next/navigation";
import {getArticleData} from "@/lib/articles";
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

    return <ArticleContent articleData={articleData} />;
};

export default Article;