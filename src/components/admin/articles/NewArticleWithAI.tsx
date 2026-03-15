"use client";

import { useState } from "react";
import { ArticleForm } from "@/components/admin/articles/ArticleForm";
import { AIGeneratePanel } from "@/components/admin/articles/AIGeneratePanel";
import type { GeneratedArticle } from "@/lib/ai/generate-article";

export function NewArticleWithAI() {
  const [aiData, setAiData] = useState<GeneratedArticle | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [showAI, setShowAI] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Yeni Makale
        </h1>
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

      {showAI && (
        <AIGeneratePanel
          onGenerated={(data) => {
            setAiData(data);
            setFormKey((k) => k + 1);
            setShowAI(false);
          }}
        />
      )}

      {aiData && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm text-green-400">
          AI makale olusturdu! Asagidaki formu inceleyip duzenleyebilirsiniz.
        </div>
      )}

      <ArticleForm key={formKey} initialAIData={aiData ?? undefined} />
    </div>
  );
}
