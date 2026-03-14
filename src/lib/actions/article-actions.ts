"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { articles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";

const articleSchema = z.object({
  title: z.string().min(1, "Baslik gerekli"),
  slug: z.string().min(1, "Slug gerekli"),
  excerpt: z.string().min(1, "Ozet gerekli"),
  content: z.string().min(1, "Icerik gerekli"),
  category: z.string().min(1, "Kategori gerekli"),
  coverImage: z.string().min(1, "Kapak gorseli gerekli"),
  readingTime: z.coerce.number().min(1).default(5),
  author: z.string().default("TeknoDergi"),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
});

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

export async function createArticle(formData: FormData) {
  await requireAuth();

  const raw = Object.fromEntries(formData.entries());
  const tagsRaw = formData.get("tags") as string;
  const data = articleSchema.parse({
    ...raw,
    tags: tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [],
    featured: raw.featured === "true",
    readingTime: Number(raw.readingTime) || 5,
  });

  const publishedAt =
    data.status === "published" ? new Date() : null;

  await db.insert(articles).values({
    ...data,
    publishedAt,
    seoTitle: data.seoTitle ?? null,
    seoDescription: data.seoDescription ?? null,
  });

  revalidatePath("/");
  revalidatePath("/admin/articles");
  return { success: true };
}

export async function updateArticle(id: number, formData: FormData) {
  await requireAuth();

  const raw = Object.fromEntries(formData.entries());
  const tagsRaw = formData.get("tags") as string;
  const data = articleSchema.parse({
    ...raw,
    tags: tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [],
    featured: raw.featured === "true",
    readingTime: Number(raw.readingTime) || 5,
  });

  const existing = await db
    .select({ publishedAt: articles.publishedAt, status: articles.status })
    .from(articles)
    .where(eq(articles.id, id))
    .limit(1);

  let publishedAt = existing[0]?.publishedAt ?? null;
  if (data.status === "published" && existing[0]?.status === "draft") {
    publishedAt = new Date();
  }

  await db
    .update(articles)
    .set({
      ...data,
      publishedAt,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      updatedAt: new Date(),
    })
    .where(eq(articles.id, id));

  revalidatePath("/");
  revalidatePath(`/haber/${data.slug}`);
  revalidatePath(`/kategori/${data.category}`);
  revalidatePath("/admin/articles");
  return { success: true };
}

export async function deleteArticle(id: number) {
  await requireAuth();

  const existing = await db
    .select({ slug: articles.slug, category: articles.category })
    .from(articles)
    .where(eq(articles.id, id))
    .limit(1);

  await db.delete(articles).where(eq(articles.id, id));

  revalidatePath("/");
  if (existing[0]) {
    revalidatePath(`/haber/${existing[0].slug}`);
    revalidatePath(`/kategori/${existing[0].category}`);
  }
  revalidatePath("/admin/articles");
  return { success: true };
}

export async function toggleArticleStatus(id: number) {
  await requireAuth();

  const existing = await db
    .select({ status: articles.status, slug: articles.slug, category: articles.category })
    .from(articles)
    .where(eq(articles.id, id))
    .limit(1);

  if (!existing[0]) throw new Error("Article not found");

  const newStatus = existing[0].status === "published" ? "draft" : "published";
  const publishedAt = newStatus === "published" ? new Date() : null;

  await db
    .update(articles)
    .set({ status: newStatus, publishedAt, updatedAt: new Date() })
    .where(eq(articles.id, id));

  revalidatePath("/");
  revalidatePath(`/haber/${existing[0].slug}`);
  revalidatePath(`/kategori/${existing[0].category}`);
  revalidatePath("/admin/articles");
  return { success: true, status: newStatus };
}
