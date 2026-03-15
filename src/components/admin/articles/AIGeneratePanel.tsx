"use client";

import { useState, useTransition } from "react";
import { generateArticleAction } from "@/lib/actions/ai-actions";
import type { GeneratedArticle } from "@/lib/ai/generate-article";

const ARTICLE_TYPES = [
  { value: "", label: "Otomatik (AI karar versin)" },
  { value: "Yatırım haberi", label: "Yatırım Haberi" },
  { value: "Ürün / özellik duyurusu", label: "Ürün Duyurusu" },
  { value: "Girişim tanıtımı", label: "Girişim Tanıtımı" },
  { value: "Analiz / gündem yazısı", label: "Analiz / Gündem" },
  { value: "Kurumsal karar / stratejik hamle", label: "Kurumsal Karar" },
  { value: "Söylenti / beklenti haberi", label: "Söylenti / Beklenti" },
];

interface AIGeneratePanelProps {
  onGenerated: (article: GeneratedArticle) => void;
}

export function AIGeneratePanel({ onGenerated }: AIGeneratePanelProps) {
  const [topic, setTopic] = useState("");
  const [articleType, setArticleType] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setError("");

    startTransition(async () => {
      try {
        const result = await generateArticleAction(
          topic.trim(),
          articleType || undefined
        );
        onGenerated(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Makale olusturulamadi"
        );
      }
    });
  };

  return (
    <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-accent/5 to-transparent p-5 space-y-4">
      <div className="flex items-center gap-2">
        <svg
          className="h-5 w-5 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>
        <h3 className="font-display text-sm font-semibold text-accent">
          AI ile Makale Olustur
        </h3>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-secondary">
          Konu veya Kaynak
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={3}
          disabled={isPending}
          className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-sm text-text-primary placeholder-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none disabled:opacity-50"
          placeholder="Ornek: OpenAI, GPT-5 modelini duyurdu. Yeni model multimodal yetenekleri ve 1 milyon token context window ile geliyor..."
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-secondary">
          Makale Turu
        </label>
        <select
          value={articleType}
          onChange={(e) => setArticleType(e.target.value)}
          disabled={isPending}
          className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
        >
          {ARTICLE_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isPending || !topic.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
      >
        {isPending ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            AI makale olusturuyor...
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4"
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
            AI ile Olustur
          </>
        )}
      </button>
    </div>
  );
}
