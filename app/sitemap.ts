import { MetadataRoute } from 'next'
import { getSortedArticles } from '@/lib/articles'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getSortedArticles()
  const baseUrl = 'https://mindcanvas.vercel.app' // Replace with your real domain

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/${article.id}`,
    lastModified: new Date(), // Ideally this would be the actual last modified date of the file
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...articleEntries,
  ]
}
