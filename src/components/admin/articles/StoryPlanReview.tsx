"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import {
  generateStoryPlanAction,
  writeArticleFromPlanAction,
  scoreStoryPlanAction,
  fetchSourceUrlAction,
} from "@/lib/actions/ai-actions";
import type { StoryPlanInput, StoryPlan } from "@/lib/ai/generate-story-plan";
import type { GeneratedArticle } from "@/lib/ai/write-article-from-plan";
import type { StoryPlanScorecard, CriterionScore } from "@/lib/ai/score-story-plan";

// ── Constants ──

const ARTICLE_TYPES = [
  { value: "", label: "Otomatik (AI karar versin)" },
  { value: "Yatırım haberi", label: "Yatırım Haberi" },
  { value: "Ürün / özellik duyurusu", label: "Ürün Duyurusu" },
  { value: "Girişim tanıtımı", label: "Girişim Tanıtımı" },
  { value: "Analiz / gündem yazısı", label: "Analiz / Gündem" },
  { value: "Kurumsal karar / stratejik hamle", label: "Kurumsal Karar" },
  { value: "Söylenti / beklenti haberi", label: "Söylenti / Beklenti" },
  { value: "Halka arz / finansal süreç haberi", label: "Halka Arz" },
  { value: "Rehber / how-to", label: "Rehber" },
];

const CATEGORY_OPTIONS = [
  { value: "yapay-zeka", label: "Yapay Zeka" },
  { value: "startup", label: "Startup" },
  { value: "big-tech", label: "Big Tech" },
  { value: "yazilim", label: "Yazılım" },
  { value: "donanim", label: "Donanım" },
  { value: "mobilite", label: "Mobilite" },
];

const CRITERION_LABELS: Record<string, string> = {
  tur_secimi: "Tür Seçimi",
  ana_olgu_koruma: "Ana Olgu Koruma",
  kritik_detay_koruma: "Kritik Detay Koruma",
  kaynak_gorunurlugu: "Kaynak Görünürlüğü",
  teknik_operasyonel_netlik: "Teknik / Operasyonel Netlik",
  baglam_gucu: "Bağlam Gücü",
  haber_degeri_yogunlugu: "Haber Değeri Yoğunluğu",
  pr_dili_riski: "PR Dili Riski",
};

// ── Shared Styles ──

const INPUT_CLS =
  "w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-sm text-text-primary placeholder-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

const TEXTAREA_CLS = `${INPUT_CLS} resize-none`;

const LABEL_CLS = "mb-1.5 block text-sm font-medium text-text-secondary";

const CARD_CLS = "rounded-xl border border-border bg-surface-1 p-5 space-y-4";

const SECTION_TITLE_CLS =
  "font-display text-sm font-semibold text-text-primary";

// ── Types ──

type Stage = "input" | "plan" | "article";

interface InputFields {
  topic: string;
  articleType: string;
  sourceText: string;
  sourceUrl: string;
  editorNote: string;
}

interface StoryPlanReviewProps {
  initialInput?: Partial<StoryPlanInput>;
  onArticleGenerated?: (article: GeneratedArticle) => void;
}

// ── Helpers ──

function toActionInput(fields: InputFields): StoryPlanInput {
  return {
    topic: fields.topic.trim(),
    articleType: fields.articleType || undefined,
    sourceText: fields.sourceText.trim() || undefined,
    sourceUrl: fields.sourceUrl.trim() || undefined,
    editorNote: fields.editorNote.trim() || undefined,
  };
}

function buildInitialInput(init?: Partial<StoryPlanInput>): InputFields {
  return {
    topic: init?.topic ?? "",
    articleType: init?.articleType ?? "",
    sourceText: init?.sourceText ?? "",
    sourceUrl: init?.sourceUrl ?? "",
    editorNote: init?.editorNote ?? "",
  };
}

function getScoreColor(score: number): string {
  if (score >= 8) return "bg-green-500";
  if (score >= 5) return "bg-yellow-500";
  return "bg-red-500";
}

function getScoreTextColor(score: number): string {
  if (score >= 8) return "text-green-400";
  if (score >= 5) return "text-yellow-400";
  return "text-red-400";
}

// ── Icons ──

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
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
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function XMarkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
      />
    </svg>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
      />
    </svg>
  );
}

// ── Step Indicator ──

function StepIndicator({ stage }: { stage: Stage }) {
  const steps = [
    { key: "input", label: "Girdi" },
    { key: "plan", label: "Story Plan" },
    { key: "article", label: "Makale" },
  ] as const;

  const currentIndex = steps.findIndex((s) => s.key === stage);

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center gap-2">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${
              i <= currentIndex
                ? "bg-accent text-white"
                : "bg-surface-2 text-text-tertiary"
            }`}
          >
            {i + 1}
          </div>
          <span
            className={`hidden text-xs font-medium sm:inline ${
              i <= currentIndex ? "text-text-primary" : "text-text-tertiary"
            }`}
          >
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={`h-px w-6 sm:w-10 ${
                i < currentIndex ? "bg-accent" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Editable Array List ──

function EditableList({
  label,
  items,
  onChange,
  placeholder = "Yeni madde ekle...",
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const updateItem = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    onChange([...items, ""]);
  };

  return (
    <div>
      <label className={LABEL_CLS}>{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              className={INPUT_CLS}
              placeholder={placeholder}
            />
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="shrink-0 rounded-lg p-2 text-text-tertiary hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 transition-colors"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          Ekle
        </button>
      </div>
    </div>
  );
}

// ── Editable Key-Value Map ──

function EditableMap({
  label,
  entries,
  onChange,
}: {
  label: string;
  entries: Record<string, string>;
  onChange: (entries: Record<string, string>) => void;
}) {
  const pairs = Object.entries(entries);

  const updatePair = (index: number, newKey: string, newValue: string) => {
    const updated = pairs.map((pair, i) =>
      i === index ? [newKey, newValue] : pair
    );
    onChange(Object.fromEntries(updated));
  };

  const removePair = (index: number) => {
    onChange(Object.fromEntries(pairs.filter((_, i) => i !== index)));
  };

  const addPair = () => {
    onChange({ ...entries, "": "" });
  };

  return (
    <div>
      <label className={LABEL_CLS}>{label}</label>
      <div className="space-y-2">
        {pairs.map(([key, value], i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={key}
              onChange={(e) => updatePair(i, e.target.value, value)}
              className={`${INPUT_CLS} max-w-[40%]`}
              placeholder="Aktör"
            />
            <input
              value={value}
              onChange={(e) => updatePair(i, key, e.target.value)}
              className={INPUT_CLS}
              placeholder="Rolü"
            />
            <button
              type="button"
              onClick={() => removePair(i)}
              className="shrink-0 rounded-lg p-2 text-text-tertiary hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addPair}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 transition-colors"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          Ekle
        </button>
      </div>
    </div>
  );
}

// ── Criterion Score Row ──

function CriterionRow({
  label,
  criterion,
}: {
  label: string;
  criterion: CriterionScore;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary">{label}</span>
        <span className={`text-xs font-bold ${getScoreTextColor(criterion.skor)}`}>
          {criterion.skor}/10
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-surface-2">
        <div
          className={`h-1.5 rounded-full transition-all ${getScoreColor(criterion.skor)}`}
          style={{ width: `${criterion.skor * 10}%` }}
        />
      </div>
      <p className="text-xs text-text-tertiary">{criterion.not}</p>
    </div>
  );
}

// ── Scorecard Display ──

function ScorecardDisplay({ scorecard }: { scorecard: StoryPlanScorecard }) {
  const isReady = scorecard.genel_karar === "Hazır";

  return (
    <div
      className={`rounded-xl border p-5 space-y-5 ${
        isReady
          ? "border-green-500/30 bg-green-500/5"
          : "border-yellow-500/30 bg-yellow-500/5"
      }`}
    >
      {/* Header: Score + Verdict */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheckIcon className={`h-5 w-5 ${isReady ? "text-green-400" : "text-yellow-400"}`} />
          <h4 className="font-display text-sm font-semibold text-text-primary">
            Kalite Kontrolü
          </h4>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-bold ${
              isReady
                ? "border-green-500/30 bg-green-400/10 text-green-400"
                : "border-yellow-500/30 bg-yellow-400/10 text-yellow-400"
            }`}
          >
            {scorecard.genel_karar}
          </span>
          <span
            className={`text-2xl font-bold ${
              isReady ? "text-green-400" : "text-yellow-400"
            }`}
          >
            {scorecard.toplam_skor}
            <span className="text-sm font-normal text-text-tertiary">/100</span>
          </span>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="h-2 w-full rounded-full bg-surface-2">
        <div
          className={`h-2 rounded-full transition-all ${
            isReady ? "bg-green-500" : "bg-yellow-500"
          }`}
          style={{ width: `${scorecard.toplam_skor}%` }}
        />
      </div>

      {/* Criteria grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {(Object.keys(scorecard.kriterler) as Array<keyof typeof scorecard.kriterler>).map(
          (key) => (
            <CriterionRow
              key={key}
              label={CRITERION_LABELS[key] ?? key}
              criterion={scorecard.kriterler[key]}
            />
          )
        )}
      </div>

      {/* Missing items */}
      {scorecard.eksikler.length > 0 && (
        <div className="space-y-2 border-t border-border pt-4">
          <h5 className="text-xs font-semibold text-red-400">Eksikler</h5>
          <ul className="space-y-1">
            {scorecard.eksikler.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                <span className="mt-0.5 shrink-0 text-red-400">&bull;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Required additions */}
      {scorecard.yaziya_gecmeden_once_eklenmesi_gerekenler.length > 0 && (
        <div className="space-y-2 border-t border-border pt-4">
          <h5 className="text-xs font-semibold text-yellow-400">
            Yazıya Geçmeden Önce Eklenmeli
          </h5>
          <ul className="space-y-1">
            {scorecard.yaziya_gecmeden_once_eklenmesi_gerekenler.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                <span className="mt-0.5 shrink-0 text-yellow-400">&bull;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Main Component ──

export function StoryPlanReview({
  initialInput,
  onArticleGenerated,
}: StoryPlanReviewProps) {
  // Stage
  const [stage, setStage] = useState<Stage>("input");

  // Consolidated input state
  const [input, setInput] = useState<InputFields>(() =>
    buildInitialInput(initialInput)
  );

  // Plan & article state
  const [plan, setPlan] = useState<StoryPlan | null>(null);
  const [article, setArticle] = useState<GeneratedArticle | null>(null);

  // Scorecard state
  const [scorecard, setScorecard] = useState<StoryPlanScorecard | null>(null);

  // URL fetch state
  const [isFetching, setIsFetching] = useState(false);
  const [fetchMessage, setFetchMessage] = useState("");

  // UI state — separate transitions for main flow and scoring
  const [isPending, startTransition] = useTransition();
  const [isScoring, startScoring] = useTransition();
  const [error, setError] = useState("");

  // ── Input field updater ──

  const updateInput = (field: keyof InputFields, value: string) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  // ── URL Fetch ──

  const fetchUrlRef = useRef<string>("");

  const handleFetchUrl = async (urlOverride?: string) => {
    const url = (urlOverride ?? input.sourceUrl).trim();
    if (!url) return;

    // Prevent duplicate fetches for same URL
    if (fetchUrlRef.current === url && isFetching) return;
    fetchUrlRef.current = url;

    setIsFetching(true);
    setFetchMessage("");
    setError("");

    try {
      const result = await fetchSourceUrlAction(url);

      if (result.success && result.text) {
        setInput((prev) => ({
          ...prev,
          sourceText: result.text,
          // Pre-fill topic from title if topic is empty
          topic: prev.topic.trim() ? prev.topic : result.title ?? prev.topic,
        }));
        setFetchMessage(
          result.error
            ? `Kısmi başarı: ${result.error}`
            : `İçerik çekildi (${Math.round(result.text.length / 1000)}K karakter)`
        );
      } else {
        setFetchMessage("");
        setError(
          result.error ?? "İçerik çıkarılamadı — metni manuel yapıştırın"
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "URL fetch başarısız"
      );
    } finally {
      setIsFetching(false);
    }
  };

  // Auto-fetch when a URL is pasted
  const prevUrlRef = useRef("");
  useEffect(() => {
    const url = input.sourceUrl.trim();
    // Only trigger on new valid URLs (not on every keystroke)
    if (
      url &&
      url !== prevUrlRef.current &&
      url.startsWith("http") &&
      url.includes(".")
    ) {
      prevUrlRef.current = url;
      handleFetchUrl(url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.sourceUrl]);

  // ── Plan field updater (clears scorecard on edit) ──

  const updatePlanField = <K extends keyof StoryPlan>(
    field: K,
    value: StoryPlan[K]
  ) => {
    if (!plan) return;
    setPlan({ ...plan, [field]: value });
    setScorecard(null);
  };

  // ── Stage 1: Generate Plan ──

  const handleGeneratePlan = () => {
    if (!input.topic.trim()) return;
    setError("");

    startTransition(async () => {
      try {
        const result = await generateStoryPlanAction(toActionInput(input));
        setPlan(result);
        setScorecard(null);
        setStage("plan");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Story plan oluşturulamadı"
        );
      }
    });
  };

  // ── Stage 1.5: Score Plan ──

  const handleScorePlan = () => {
    if (!plan) return;
    setError("");

    startScoring(async () => {
      try {
        const result = await scoreStoryPlanAction(plan);
        setScorecard(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Scorecard oluşturulamadı"
        );
      }
    });
  };

  // ── Stage 2: Generate Article ──

  const handleGenerateArticle = () => {
    if (!plan) return;
    setError("");

    startTransition(async () => {
      try {
        const result = await writeArticleFromPlanAction(plan);
        setArticle(result);
        setStage("article");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Makale oluşturulamadı"
        );
      }
    });
  };

  // ── Reset ──

  const handleReset = () => {
    setStage("input");
    setPlan(null);
    setArticle(null);
    setScorecard(null);
    setError("");
    setFetchMessage("");
  };

  // Derived state
  const needsRevision = scorecard?.genel_karar === "Revize gerekli";

  return (
    <div className="space-y-5">
      {/* Header with step indicator */}
      <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-accent/5 to-transparent px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-accent" />
            <h3 className="font-display text-sm font-semibold text-accent">
              AI Haber Üretimi
            </h3>
          </div>
          <StepIndicator stage={stage} />
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ─── STAGE 1: Input ─── */}
      {stage === "input" && (
        <div className={CARD_CLS}>
          <h3 className={SECTION_TITLE_CLS}>Haber Girdileri</h3>

          <div>
            <label className={LABEL_CLS}>Konu *</label>
            <textarea
              value={input.topic}
              onChange={(e) => updateInput("topic", e.target.value)}
              rows={3}
              disabled={isPending}
              className={`${TEXTAREA_CLS} disabled:opacity-50`}
              placeholder="Haberin konusu, kaynak metin veya URL..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL_CLS}>Haber Türü</label>
              <select
                value={input.articleType}
                onChange={(e) => updateInput("articleType", e.target.value)}
                disabled={isPending}
                className={`${INPUT_CLS} disabled:opacity-50`}
              >
                {ARTICLE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Kaynak URL</label>
              <div className="flex gap-2">
                <input
                  value={input.sourceUrl}
                  onChange={(e) => {
                    updateInput("sourceUrl", e.target.value);
                    setFetchMessage("");
                  }}
                  disabled={isPending || isFetching}
                  className={`${INPUT_CLS} disabled:opacity-50`}
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={() => handleFetchUrl()}
                  disabled={
                    isPending || isFetching || !input.sourceUrl.trim()
                  }
                  className="shrink-0 rounded-lg border border-accent/30 px-3 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent/10 disabled:opacity-40"
                  title="URL'den içerik çek"
                >
                  {isFetching ? (
                    <SpinnerIcon className="h-4 w-4" />
                  ) : (
                    "Çek"
                  )}
                </button>
              </div>
              {fetchMessage && (
                <p className="mt-1.5 text-xs text-green-400">
                  {fetchMessage}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>Kaynak Metin</label>
            <textarea
              value={input.sourceText}
              onChange={(e) => updateInput("sourceText", e.target.value)}
              rows={4}
              disabled={isPending}
              className={`${TEXTAREA_CLS} disabled:opacity-50`}
              placeholder="Haberin kaynak metnini yapıştırın..."
            />
          </div>

          <div>
            <label className={LABEL_CLS}>Editör Notu</label>
            <textarea
              value={input.editorNote}
              onChange={(e) => updateInput("editorNote", e.target.value)}
              rows={2}
              disabled={isPending}
              className={`${TEXTAREA_CLS} disabled:opacity-50`}
              placeholder="AI'ya özel talimat veya not..."
            />
          </div>

          <button
            type="button"
            onClick={handleGeneratePlan}
            disabled={isPending || !input.topic.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <SpinnerIcon className="h-4 w-4" />
                Story plan oluşturuluyor...
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4" />
                Story Plan Oluştur
              </>
            )}
          </button>
        </div>
      )}

      {/* ─── STAGE 2: Plan Review ─── */}
      {stage === "plan" && plan && (
        <div className="space-y-5">
          {/* Plan header */}
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-text-primary">
              Story Plan İnceleme
            </h3>
            <button
              type="button"
              onClick={() => setStage("input")}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-2 transition-colors"
            >
              &larr; Girdilere Dön
            </button>
          </div>

          {/* Basic info */}
          <div className={CARD_CLS}>
            <h4 className={SECTION_TITLE_CLS}>Temel Bilgiler</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL_CLS}>Tür</label>
                <input
                  value={plan.tur}
                  onChange={(e) => updatePlanField("tur", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Kategori Önerisi</label>
                <select
                  value={plan.kategori_onerisi}
                  onChange={(e) =>
                    updatePlanField("kategori_onerisi", e.target.value)
                  }
                  className={INPUT_CLS}
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={LABEL_CLS}>Haber Açısı</label>
              <textarea
                value={plan.haber_acisi}
                onChange={(e) =>
                  updatePlanField("haber_acisi", e.target.value)
                }
                rows={2}
                className={TEXTAREA_CLS}
              />
            </div>
          </div>

          {/* 5W1H */}
          <div className={CARD_CLS}>
            <h4 className={SECTION_TITLE_CLS}>5N1K</h4>
            <EditableList
              label="Kim"
              items={plan.kim}
              onChange={(v) => updatePlanField("kim", v)}
              placeholder="Aktör adı..."
            />
            <div>
              <label className={LABEL_CLS}>Ne Oldu</label>
              <textarea
                value={plan.ne_oldu}
                onChange={(e) =>
                  updatePlanField("ne_oldu", e.target.value)
                }
                rows={2}
                className={TEXTAREA_CLS}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL_CLS}>Nerede</label>
                <input
                  value={plan.nerede}
                  onChange={(e) =>
                    updatePlanField("nerede", e.target.value)
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Ne Zaman</label>
                <input
                  value={plan.ne_zaman}
                  onChange={(e) =>
                    updatePlanField("ne_zaman", e.target.value)
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>
            <div>
              <label className={LABEL_CLS}>Neden Önemli</label>
              <textarea
                value={plan.neden_onemli}
                onChange={(e) =>
                  updatePlanField("neden_onemli", e.target.value)
                }
                rows={2}
                className={TEXTAREA_CLS}
              />
            </div>
          </div>

          {/* Facts & details */}
          <div className={CARD_CLS}>
            <h4 className={SECTION_TITLE_CLS}>Gerçekler & Detaylar</h4>
            <EditableList
              label="Kritik Maddi Gerçekler"
              items={plan.kritik_maddi_gercekler}
              onChange={(v) => updatePlanField("kritik_maddi_gercekler", v)}
              placeholder="Doğrulanabilir gerçek..."
            />
            <EditableList
              label="Teknik Detaylar"
              items={plan.teknik_detaylar}
              onChange={(v) => updatePlanField("teknik_detaylar", v)}
              placeholder="Teknik detay..."
            />
            <EditableList
              label="Finansal Detaylar"
              items={plan.finansal_detaylar}
              onChange={(v) => updatePlanField("finansal_detaylar", v)}
              placeholder="Finansal veri..."
            />
          </div>

          {/* Context & sources */}
          <div className={CARD_CLS}>
            <h4 className={SECTION_TITLE_CLS}>Bağlam & Kaynaklar</h4>
            <EditableList
              label="Bağlam"
              items={plan.baglam}
              onChange={(v) => updatePlanField("baglam", v)}
              placeholder="Sektörel bağlam..."
            />
            <EditableList
              label="Kaynak Dayanakları"
              items={plan.kaynak_dayanaklari}
              onChange={(v) => updatePlanField("kaynak_dayanaklari", v)}
              placeholder="Kaynak..."
            />
            <EditableList
              label="Belirsiz Noktalar"
              items={plan.belirsiz_noktalar}
              onChange={(v) => updatePlanField("belirsiz_noktalar", v)}
              placeholder="Belirsiz nokta..."
            />
          </div>

          {/* Roles & tags */}
          <div className={CARD_CLS}>
            <h4 className={SECTION_TITLE_CLS}>Roller & Etiketler</h4>
            <EditableMap
              label="Rol Dağılımı"
              entries={plan.rol_dagilimi}
              onChange={(v) => updatePlanField("rol_dagilimi", v)}
            />
            <EditableList
              label="Etiket Önerileri"
              items={plan.etiket_onerileri}
              onChange={(v) => updatePlanField("etiket_onerileri", v)}
              placeholder="Etiket..."
            />
          </div>

          {/* ── Score button ── */}
          <button
            type="button"
            onClick={handleScorePlan}
            disabled={isScoring || isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface-1 px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-2 disabled:opacity-50"
          >
            {isScoring ? (
              <>
                <SpinnerIcon className="h-4 w-4" />
                Plan denetleniyor...
              </>
            ) : (
              <>
                <ShieldCheckIcon className="h-4 w-4" />
                {scorecard ? "Tekrar Denetle" : "Planı Denetle"}
              </>
            )}
          </button>

          {/* ── Scorecard display ── */}
          {scorecard && <ScorecardDisplay scorecard={scorecard} />}

          {/* ── Write article button (with revision warning) ── */}
          {needsRevision && (
            <div className="flex items-start gap-2.5 rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-3">
              <WarningIcon className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
              <p className="text-xs leading-relaxed text-yellow-400">
                Scorecard &quot;Revize gerekli&quot; diyor. Planı düzenleyip tekrar
                denetlemeniz önerilir. Yine de devam edebilirsiniz.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleGenerateArticle}
            disabled={isPending || isScoring}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
              needsRevision
                ? "bg-yellow-600 hover:bg-yellow-600/90"
                : "bg-accent hover:bg-accent/90"
            }`}
          >
            {isPending ? (
              <>
                <SpinnerIcon className="h-4 w-4" />
                Makale yazılıyor...
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4" />
                {needsRevision
                  ? "Yine de Bu Planla Haberi Yaz"
                  : "Bu Planla Haberi Yaz"}
              </>
            )}
          </button>
        </div>
      )}

      {/* ─── STAGE 3: Article Preview ─── */}
      {stage === "article" && article && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-text-primary">
              Üretilen Makale
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStage("plan")}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-2 transition-colors"
              >
                &larr; Plana Dön
              </button>
              <button
                type="button"
                onClick={handleGenerateArticle}
                disabled={isPending}
                className="rounded-lg border border-accent/30 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 transition-colors disabled:opacity-50"
              >
                {isPending ? "Yazılıyor..." : "Tekrar Yaz"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-2 transition-colors"
              >
                Sıfırla
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm text-green-400">
            Makale başarıyla üretildi! Önizlemeyi inceleyin, uygunsa
            &quot;Makaleyi Kullan&quot; ile devam edin.
          </div>

          <div className={CARD_CLS}>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                {article.tur}
              </span>
              <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-text-secondary">
                {article.kategori}
              </span>
            </div>
            <h2 className="font-display text-lg font-bold leading-tight text-text-primary">
              {article.baslik}
            </h2>
            <p className="text-sm italic leading-relaxed text-text-secondary">
              {article.spot}
            </p>
            <div className="border-t border-border pt-4">
              <div
                className="prose-article text-sm leading-relaxed text-text-primary"
                dangerouslySetInnerHTML={{ __html: article.metin }}
              />
            </div>
            {article.etiketler.length > 0 && (
              <div className="flex flex-wrap gap-1.5 border-t border-border pt-4">
                {article.etiketler.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {onArticleGenerated && (
            <button
              type="button"
              onClick={() => onArticleGenerated(article)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-accent/90"
            >
              Makaleyi Kullan &rarr;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
