import Link from 'next/link';
import {ArrowLeftIcon} from "@heroicons/react/24/solid";
import {getArticleData} from "@/lib/articles";

const Article = async ({params}: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params; // Await the promise
    const articleData = await getArticleData(slug);

    return (
        <section className="mx-auto w-10/12 md:w-1/2 mt-20 flex flex-col gap-5">
            <div className="flex justify-between font-poppins">
                <Link href={"/"} className="flex flex-row gap-1 place-items-center">
                    <ArrowLeftIcon width={20}/>
                    <p>back to home</p>
                </Link>
                <p>{articleData.date.toString()}</p>
            </div>
            <article className="article" dangerouslySetInnerHTML={{__html: articleData.contentHtml}}/>
            {/* Author Section - Improved Styling */}
            <div className="mt-4 mb-20 p-4 rounded-lg bg-neutral-200 dark:bg-neutral-800 shadow-md text-center">
                <p className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">Written by:</p>
                <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{articleData.author}</p>
            </div>
        </section>
    )
}

export default Article;