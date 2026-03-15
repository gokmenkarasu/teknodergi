"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TipTapEditor } from "@/components/admin/editor/TipTapEditor";
import { CATEGORIES } from "@/lib/constants";
import { createArticle, updateArticle } from "@/lib/actions/article-actions";
import { uploadImage } from "@/lib/actions/upload-action";
import { FreepikPicker } from "@/components/admin/articles/FreepikPicker";
import type { AdminArticle } from "@/types/article";

interface ArticleFormProps {
  article?: AdminArticle;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState(article?.content ?? "");
  const [coverImage, setCoverImage] = useState(article?.coverImage ?? "");
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [isUploading, setIsUploading] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!article) {
      setSlug(slugify(value));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImage(formData);
      setCoverImage(result.url);
    } catch (err) {
      alert("Gorsel yuklenirken hata olustu");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    formData.set("content", content);
    formData.set("coverImage", coverImage);

    startTransition(async () => {
      try {
        if (article) {
          await updateArticle(article.id, formData);
        } else {
          await createArticle(formData);
        }
        router.push("/admin/articles");
        router.refresh();
      } catch (err) {
        alert("Bir hata olustu");
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Baslik
            </label>
            <input
              name="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-text-primary placeholder-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Makale basligi"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Slug
            </label>
            <input
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-text-primary placeholder-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="makale-slug"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Ozet
            </label>
            <textarea
              name="excerpt"
              defaultValue={article?.excerpt ?? ""}
              required
              rows={3}
              className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-text-primary placeholder-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
              placeholder="Kisa ozet (2-3 cumle)"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Icerik
            </label>
            <TipTapEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
            <h3 className="font-display text-sm font-semibold text-text-primary">
              Yayin Ayarlari
            </h3>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Durum
              </label>
              <select
                name="status"
                defaultValue={article?.status ?? "draft"}
                className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="draft">Taslak</option>
                <option value="published">Yayinda</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Kategori
              </label>
              <select
                name="category"
                defaultValue={article?.category ?? ""}
                required
                className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="" disabled>
                  Kategori secin
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
                Okuma Suresi (dk)
              </label>
              <input
                name="readingTime"
                type="number"
                min={1}
                defaultValue={article?.readingTime ?? 5}
                className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Yazar
              </label>
              <input
                name="author"
                defaultValue={article?.author ?? "TeknoDergi"}
                className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Etiketler (virgul ile)
              </label>
              <input
                name="tags"
                defaultValue={article?.tags?.join(", ") ?? ""}
                className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-text-primary placeholder-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="AI, Startup, Teknoloji"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                value="true"
                defaultChecked={article?.featured ?? false}
                id="featured"
                className="h-4 w-4 rounded border-border bg-surface-0 text-accent focus:ring-accent"
              />
              <label htmlFor="featured" className="text-sm text-text-secondary">
                One Cikan Haber
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
            <h3 className="font-display text-sm font-semibold text-text-primary">
              Kapak Gorseli
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
              <p className="text-xs text-text-tertiary">Yukleniyor...</p>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                veya URL
              </label>
              <input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-sm text-text-primary placeholder-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="/images/articles/cover.svg"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
            <h3 className="font-display text-sm font-semibold text-text-primary">
              SEO
            </h3>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                SEO Baslik
              </label>
              <input
                name="seoTitle"
                defaultValue={article?.seoTitle ?? ""}
                className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-sm text-text-primary placeholder-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Bos birakilirsa baslik kullanilir"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                SEO Aciklama
              </label>
              <textarea
                name="seoDescription"
                defaultValue={article?.seoDescription ?? ""}
                rows={2}
                className="w-full rounded-lg border border-border bg-surface-0 px-4 py-2.5 text-sm text-text-primary placeholder-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                placeholder="Bos birakilirsa ozet kullanilir"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-border pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-2 transition-colors"
        >
          Iptal
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-light transition-colors disabled:opacity-50"
        >
          {isPending
            ? "Kaydediliyor..."
            : article
            ? "Guncelle"
            : "Olustur"}
        </button>
      </div>
    </form>
  );
}
