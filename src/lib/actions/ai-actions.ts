"use server";

import { auth } from "@/lib/auth";
import {
  generateArticle,
  type GeneratedArticle,
} from "@/lib/ai/generate-article";
import {
  generateStoryPlan,
  type StoryPlanInput,
  type StoryPlan,
} from "@/lib/ai/generate-story-plan";
import {
  writeArticleFromPlan,
  type GeneratedArticle as PlanArticle,
} from "@/lib/ai/write-article-from-plan";
import {
  scoreStoryPlan,
  type StoryPlanScorecard,
} from "@/lib/ai/score-story-plan";
import {
  fetchSourceUrl,
  type FetchResult,
} from "@/lib/ai/fetch-source-url";

// ── Auth Helper ──

async function requireAdminAuth(): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Oturum açmanız gerekiyor");
  }
}

// ── Legacy: Single-step article generation ──

export async function generateArticleAction(
  topic: string,
  articleType?: string
): Promise<GeneratedArticle> {
  await requireAdminAuth();
  if (!topic.trim()) throw new Error("Konu boş olamaz");

  return generateArticle(topic.trim(), articleType);
}

// ── URL Fetch ──

export async function fetchSourceUrlAction(
  url: string
): Promise<FetchResult> {
  await requireAdminAuth();
  if (!url.trim()) throw new Error("URL boş olamaz");

  return fetchSourceUrl(url.trim());
}

// ── Stage 1: Story Plan ──

export async function generateStoryPlanAction(
  input: StoryPlanInput
): Promise<StoryPlan> {
  await requireAdminAuth();
  if (!input.topic.trim()) throw new Error("Konu boş olamaz");

  return generateStoryPlan({
    ...input,
    topic: input.topic.trim(),
    sourceText: input.sourceText?.trim() || undefined,
    sourceUrl: input.sourceUrl?.trim() || undefined,
    editorNote: input.editorNote?.trim() || undefined,
  });
}

// ── Stage 1.5: Story Plan Scorecard ──

export async function scoreStoryPlanAction(
  plan: StoryPlan
): Promise<StoryPlanScorecard> {
  await requireAdminAuth();
  if (!plan.tur || !plan.ne_oldu) {
    throw new Error("Story plan eksik: tür ve ne_oldu alanları zorunlu");
  }

  return scoreStoryPlan(plan);
}

// ── Stage 2: Article from Plan ──

export async function writeArticleFromPlanAction(
  plan: StoryPlan
): Promise<PlanArticle> {
  await requireAdminAuth();
  if (!plan.tur || !plan.ne_oldu) {
    throw new Error("Story plan eksik: tür ve ne_oldu alanları zorunlu");
  }

  return writeArticleFromPlan(plan);
}
