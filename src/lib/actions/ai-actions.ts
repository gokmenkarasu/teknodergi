"use server";

import { auth } from "@/lib/auth";
import {
  generateArticle,
  type GeneratedArticle,
} from "@/lib/ai/generate-article";

export async function generateArticleAction(
  topic: string,
  articleType?: string
): Promise<GeneratedArticle> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  if (!topic.trim()) throw new Error("Konu boş olamaz");

  return generateArticle(topic.trim(), articleType);
}
