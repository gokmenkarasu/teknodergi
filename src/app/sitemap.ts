import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllArticles } from "@/lib/db/queries";
import { CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let allArticles: Awaited<ReturnType<typeof getAllArticles>> = [];
  try {
    allArticles = await getAllArticles();
  } catch {
    // DB not available yet
  }

  const articleEntries = allArticles.map((article) => ({
    url: `${SITE_URL}/haber/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categories = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/kategori/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...articleEntries,
    ...categories,
  ];
}
