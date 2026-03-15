"use client";

import { useState } from "react";
import { ArticleForm } from "@/components/admin/articles/ArticleForm";
import { StoryPlanReview } from "@/components/admin/articles/StoryPlanReview";
import { AIGeneratePanel } from "@/components/admin/articles/AIGeneratePanel";
import type { GeneratedArticle } from "@/lib/ai/generate-article";
import type { GeneratedArticle as PlanArticle } from "@/lib/ai/write-article-from-plan";

// ── Helpers ──

/** Turkish-aware slugify for URL-safe strings */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .replace(/Ş/g, "s")
    .replace(/Ğ/g, "g")
    .replace(/Ü/g, "u")
    .replace(/Ö/g, "o")
    .replace(/Ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/** Estimate reading time from HTML content (~200 words/min) */
function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/** Transform 2-stage PlanArticle → ArticleForm-compatible GeneratedArticle */
function transformPlanArticle(planArticle: PlanArticle): GeneratedArticle {
  return {
    title: planArticle.baslik,
    excerpt: planArticle.spot,
    content: planArticle.metin,
    tags: planArticle.etiketler,
    category: planArticle.kategori,
    slug: slugify(planArticle.baslik),
    readingTime: estimateReadingTime(planArticle.metin),
  };
}

// ── Component ──

type AIMode = "two-stage" | "legacy";

export function NewArticleWithAI() {
  const [aiData, setAiData] = useState<GeneratedArticle | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [showAI, setShowAI] = useState(true);
  const [aiMode, setAiMode] = useState<AIMode>("two-stage");

  const handleArticleReady = (data: GeneratedArticle) => {
    setAiData(data);
    setFormKey((k) => k + 1);
    setShowAI(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Yeni Makale
        </h1>
        <div className="flex items-center gap-2">
          {/* Mode toggle — only visible when AI panel is open */}
          {showAI && (
            <button
              type="button"
              onClick={() =>
                setAiMode((m) => (m === "two-stage" ? "legacy" : "two-stage"))
              }
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-2"
            >
              {aiMode === "two-stage"
                ? "Tek Adim Mod"
                : "2 Asamali Mod"}
            </button>
          )}
          {/* Show/hide AI panel */}
          <button
            type="button"
            onClick={() => setShowAI(!showAI)}
            className="flex items-center gap-2 rounded-lg border border-accent/30 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/10"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
              />
            </svg>
            {showAI ? "AI Panelini Gizle" : "AI ile Yaz"}
          </button>
        </div>
      </div>

      {/* AI Panel: 2-Stage (default) */}
      {showAI && aiMode === "two-stage" && (
        <StoryPlanReview
          onArticleGenerated={(planArticle) =>
            handleArticleReady(transformPlanArticle(planArticle))
          }
        />
      )}

      {/* AI Panel: Legacy single-step */}
      {showAI && aiMode === "legacy" && (
        <AIGeneratePanel onGenerated={handleArticleReady} />
      )}

      {/* Success message — only when AI panel is hidden and data exists */}
      {aiData && !showAI && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm text-green-400">
          AI makale olusturdu! Asagidaki formu inceleyip duzenleyebilirsiniz.
        </div>
      )}

      {/* Article form — pre-filled with AI data when available */}
      <ArticleForm key={formKey} initialAIData={aiData ?? undefined} />
    </div>
  );
}
