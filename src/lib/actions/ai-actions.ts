"use server";

import { auth } from "@/lib/auth";
import {
  fetchSourceUrl,
  type FetchResult,
} from "@/lib/ai/fetch-source-url";
import {
  generateArticle,
  type ArticleInput,
  type GeneratedArticle,
} from "@/lib/ai/generate-article";

// ── Auth Helper ──

async function requireAdminAuth(): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Oturum açmanız gerekiyor");
  }
}

// ── Fetch URL content ──

export async function fetchSourceUrlAction(
  url: string
): Promise<FetchResult> {
  await requireAdminAuth();
  if (!url.trim()) throw new Error("URL boş olamaz");

  return fetchSourceUrl(url.trim());
}

// ── Generate article from source text ──

export async function generateArticleAction(
  input: ArticleInput
): Promise<GeneratedArticle> {
  await requireAdminAuth();
  if (!input.sourceText.trim()) throw new Error("Kaynak metin boş olamaz");

  return generateArticle({
    sourceText: input.sourceText.trim(),
    sourceUrl: input.sourceUrl?.trim() || undefined,
  });
}
