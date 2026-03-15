"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSourceUrlAction, generateArticleAction } from "@/lib/actions/ai-actions";
import { createArticle } from "@/lib/actions/article-actions";
import { CATEGORIES } from "@/lib/constants";
import { TipTapEditor } from "@/components/admin/editor/TipTapEditor";
import { FreepikPicker } from "@/components/admin/articles/FreepikPicker";
import { uploadImage } from "@/lib/actions/upload-action";
import type { GeneratedArticle } from "@/lib/ai/generate-article";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

type Step = "input" | "generating" | "review";

export function NewArticleWithAI() {
  const router = useRouter();

  // ── Step 1: Input state ──
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [fetchTitle, setFetchTitle] = useState("");

  // ── Step 2: Generation state ──
  const [step, setStep] = useState<Step>("input");
  const [genError, setGenError] = useState("");

  // ── Step 3: Review/edit state ──
  const [article, setArticle] = useState<GeneratedArticle | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [spot, setSpot] = useState("");
  const [content, setContent] = useState("");
  const [kategori, setKategori] = useState("");
  const [etiketler, setEtiketler] = useState("");
  const [okumaSuresi, setOkumaSuresi] = useState(5);
  const [coverImage, setCoverImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ── Fetch URL ──
  const handleFetch = async () => {
    if (!sourceUrl.trim()) return;
    setIsFetching(true);
    setFetchError("");
    setFetchTitle("");

    try {
      const result = await fetchSourceUrlAction(sourceUrl.trim());
      if (result.success && result.text) {
        setSourceText(result.text);
        if (result.title) setFetchTitle(result.title);
      } else {
        setFetchError(result.error || "İçerik çıkarılamadı");
      }
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Fetch hatası");
    } finally {
      setIsFetching(false);
    }
  };

  // ── Generate article ──
  const handleGenerate = async () => {
    if (!sourceText.trim()) return;
    setStep("generating");
    setGenError("");

    try {
      const result = await generateArticleAction({
        sourceText: sourceText.trim(),
        sourceUrl: sourceUrl.trim() || undefined,
      });

      setArticle(result);
      setTitle(result.baslik);
      setSlug(slugify(result.baslik));
      setSpot(result.spot);
      setContent(result.metin);
      setKategori(result.kategori);
      setEtiketler(result.etiketler.join(", "));
      setOkumaSuresi(result.okumaSuresi);
      setStep("review");
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Üretim hatası");
      setStep("input");
    }
  };

  // ── Save article ──
  const handleSave = async (status: "draft" | "published") => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("slug", slug);
      formData.set("excerpt", spot);
      formData.set("content", content);
      formData.set("category", kategori);
      formData.set("tags", etiketler);
      formData.set("readingTime", String(okumaSuresi));
      formData.set("author", "TeknoDergi");
      formData.set("coverImage", coverImage);
      formData.set("status", status);
      formData.set("featured", "false");

      await createArticle(formData);
      router.push("/admin/articles");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Kayıt hatası");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Image upload ──
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImage(formData);
      setCoverImage(result.url);
    } catch {
      alert("Görsel yüklenirken hata oluştu");
    } finally {
      setIsUploading(false);
    }
  };

  // ── Reset ──
  const handleReset = () => {
    setStep("input");
    setArticle(null);
    setGenError("");
  };

  // ══════════════════════════════════════════
  // STEP 1: INPUT — URL + Source Text
  // ══════════════════════════════════════════
  if (step === "input" || step === "generating") {
    return (
      <div className="space-y-6">
        {/* URL Input */}
        <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold text-text-primary">
            Kaynak URL
          </h2>
          <div className="flex gap-3">
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://techcrunch.com/2026/..."
              className="flex-1 rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-text-primary placeholder-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="button"
              onClick={handleFetch}
              disabled={isFetching || !sourceUrl.trim()}
              className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-light transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {isFetching ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Çekiliyor...
                </span>
              ) : (
                "Çek"
              )}
            </button>
          </div>
          {fetchTitle && (
            <p className="text-sm text-green-600">✓ {fetchTitle}</p>
          )}
          {fetchError && (
            <p className="text-sm text-red-500">✗ {fetchError}</p>
          )}
        </div>

        {/* Source Text */}
        <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold text-text-primary">
            Kaynak Metin
          </h2>
          <p className="text-sm text-text-tertiary">
            URL&apos;den çekilen metin aşağıda görünür. Düzenleyebilir veya manuel yapıştırabilirsiniz.
          </p>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            rows={16}
            placeholder="Kaynak haberin metni buraya gelecek..."
            className="w-full rounded-lg border border-border bg-surface-0 px-4 py-3 text-sm text-text-primary placeholder-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-y font-mono leading-relaxed"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-tertiary">
              {sourceText.length > 0
                ? `${sourceText.split(/\s+/).filter(Boolean).length} kelime`
                : ""}
            </span>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={step === "generating" || !sourceText.trim()}
              className="rounded-lg bg-green-600 px-8 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {step === "generating" ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Haber üretiliyor...
                </span>
              ) : (
                "🚀 Haberi Üret"
              )}
            </button>
          </div>
          {genError && (
            <p className="text-sm text-red-500">✗ {genError}</p>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════
  // STEP 2: REVIEW — Edit and publish
  // ══════════════════════════════════════════
  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-text-tertiary hover:text-text-primary transition-colors"
        >
          ← Geri dön
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={isSaving}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-2 transition-colors disabled:opacity-50"
          >
            Taslak Kaydet
          </button>
          <button
            type="button"
            onClick={() => handleSave("published")}
            disabled={isSaving}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-light transition-colors disabled:opacity-50"
          >
            {isSaving ? "Kaydediliyor..." : "Yayınla"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Başlık
            </label>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSlug(slugify(e.target.value));
              }}
              className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Slug
            </label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Spot
            </label>
            <textarea
              value={spot}
              onChange={(e) => setSpot(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              İçerik
            </label>
            <TipTapEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category & Tags */}
          <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
            <h3 className="font-display text-sm font-semibold text-text-primary">
              Yayın Ayarları
            </h3>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Kategori
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="" disabled>
                  Kategori seçin
                </option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Okuma Süresi (dk)
              </label>
              <input
                type="number"
                min={1}
                value={okumaSuresi}
                onChange={(e) => setOkumaSuresi(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Etiketler (virgül ile)
              </label>
              <input
                value={etiketler}
                onChange={(e) => setEtiketler(e.target.value)}
                placeholder="AI, Apple, Startup"
                className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-sm text-text-primary placeholder-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
            <h3 className="font-display text-sm font-semibold text-text-primary">
              Kapak Görseli
            </h3>

            {coverImage && (
              <img
                src={coverImage}
                alt="Kapak"
                className="w-full rounded-lg object-cover aspect-video"
              />
            )}

            <FreepikPicker
              onSelect={(url) => setCoverImage(url)}
              suggestedQuery={title ? title.split(" ").slice(0, 3).join(" ") : "technology"}
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="w-full text-sm text-text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-accent/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-accent hover:file:bg-accent/20"
            />
            {isUploading && (
              <p className="text-xs text-text-tertiary">Yükleniyor...</p>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                veya URL
              </label>
              <input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-sm text-text-primary placeholder-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
