import { db } from "./client";
import { articles, type DbArticle } from "./schema";
import { eq, desc, and, ne, sql, count } from "drizzle-orm";
import type { Article, CategorySlug, AdminArticle } from "@/types/article";

function toPublicArticle(row: DbArticle): Article {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category as CategorySlug,
    coverImage: row.coverImage,
    publishedAt: row.publishedAt?.toISOString() ?? "",
    readingTime: row.readingTime ?? 5,
    author: row.author ?? "TeknoDergi",
    tags: (row.tags ?? []) as string[],
    featured: row.featured ?? false,
  };
}

function toAdminArticle(row: DbArticle): AdminArticle {
  return {
    ...toPublicArticle(row),
    id: row.id,
    status: row.status ?? "draft",
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    createdAt: row.createdAt?.toISOString() ?? "",
    updatedAt: row.updatedAt?.toISOString() ?? "",
  };
}

// --- Public queries (published only) ---

export async function getAllArticles(): Promise<Article[]> {
  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.status, "published"))
    .orderBy(desc(articles.publishedAt));
  return rows.map(toPublicArticle);
}

export async function getArticleBySlug(
  slug: string
): Promise<Article | undefined> {
  const rows = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
    .limit(1);
  return rows[0] ? toPublicArticle(rows[0]) : undefined;
}

export async function getArticlesByCategory(
  category: CategorySlug
): Promise<Article[]> {
  const rows = await db
    .select()
    .from(articles)
    .where(
      and(eq(articles.category, category), eq(articles.status, "published"))
    )
    .orderBy(desc(articles.publishedAt));
  return rows.map(toPublicArticle);
}

export async function getFeaturedArticle(): Promise<Article | undefined> {
  const rows = await db
    .select()
    .from(articles)
    .where(
      and(eq(articles.featured, true), eq(articles.status, "published"))
    )
    .orderBy(desc(articles.publishedAt))
    .limit(1);
  return rows[0] ? toPublicArticle(rows[0]) : undefined;
}

export async function getRelatedArticles(
  article: Article,
  limit = 3
): Promise<Article[]> {
  const rows = await db
    .select()
    .from(articles)
    .where(
      and(
        eq(articles.category, article.category),
        ne(articles.slug, article.slug),
        eq(articles.status, "published")
      )
    )
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
  return rows.map(toPublicArticle);
}

// --- Admin queries (all statuses) ---

export async function getAdminArticles(): Promise<AdminArticle[]> {
  const rows = await db
    .select()
    .from(articles)
    .orderBy(desc(articles.updatedAt));
  return rows.map(toAdminArticle);
}

export async function getAdminArticleById(
  id: number
): Promise<AdminArticle | undefined> {
  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.id, id))
    .limit(1);
  return rows[0] ? toAdminArticle(rows[0]) : undefined;
}

export async function getArticleStats() {
  const [totalResult] = await db
    .select({ count: count() })
    .from(articles);
  const [publishedResult] = await db
    .select({ count: count() })
    .from(articles)
    .where(eq(articles.status, "published"));
  const [draftResult] = await db
    .select({ count: count() })
    .from(articles)
    .where(eq(articles.status, "draft"));
  const [featuredResult] = await db
    .select({ count: count() })
    .from(articles)
    .where(eq(articles.featured, true));

  return {
    total: totalResult.count,
    published: publishedResult.count,
    drafts: draftResult.count,
    featured: featuredResult.count,
  };
}

export async function getRecentAdminArticles(
  limit = 5
): Promise<AdminArticle[]> {
  const rows = await db
    .select()
    .from(articles)
    .orderBy(desc(articles.updatedAt))
    .limit(limit);
  return rows.map(toAdminArticle);
}
