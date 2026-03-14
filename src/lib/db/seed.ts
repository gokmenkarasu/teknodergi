import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { articles } from "./schema";
import { articles as staticArticles } from "@/data/articles";

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const sql = neon(url);
  const db = drizzle(sql);

  console.log("Seeding articles...");

  for (const article of staticArticles) {
    await db.insert(articles).values({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      coverImage: article.coverImage,
      publishedAt: new Date(article.publishedAt),
      readingTime: article.readingTime,
      author: article.author,
      tags: [...article.tags],
      featured: article.featured ?? false,
      status: "published",
    }).onConflictDoNothing({ target: articles.slug });

    console.log(`  Seeded: ${article.slug}`);
  }

  console.log("Done! Seeded", staticArticles.length, "articles.");
}

seed().catch(console.error);
