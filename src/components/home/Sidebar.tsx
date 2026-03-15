import Link from "next/link";
import Image from "next/image";
import type { Article, CategorySlug } from "@/types/article";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";

const dotColorMap: Record<CategorySlug, string> = {
  "yapay-zeka": "bg-cat-ai",
  startup: "bg-cat-startup",
  "big-tech": "bg-cat-bigtech",
  yazilim: "bg-cat-yazilim",
  donanim: "bg-cat-donanim",
};

interface SidebarProps {
  popularArticles: Article[];
  articleCounts: Record<CategorySlug, number>;
}

/**
 * PaperMag-inspired sidebar with:
 * 1. Popular/most-read articles list
 * 2. Categories with article counts
 * 3. Newsletter widget
 */
export function Sidebar({ popularArticles, articleCounts }: SidebarProps) {
  return (
    <aside className="space-y-8">
      {/* ── Popular Articles ── */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="h-3 w-0.5 bg-accent" />
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            En Çok Okunan
          </h3>
        </div>
        <div className="flex flex-col divide-y divide-border-subtle">
          {popularArticles.slice(0, 5).map((article, i) => (
            <Link
              key={article.slug}
              href={`/haber/${article.slug}`}
              className="group flex gap-3 py-3 first:pt-0 last:pb-0"
            >
              {/* Rank number */}
              <span className="font-display text-2xl font-black leading-none text-text-tertiary/20">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="line-clamp-2 text-[13px] font-semibold leading-snug text-text-primary transition-colors group-hover:text-accent">
                  {article.title}
                </h4>
                <span className="mt-1 block text-[11px] text-text-tertiary">
                  {article.readingTime} dk okuma
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Categories ── */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="h-3 w-0.5 bg-accent" />
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-tertiary">
            Kategoriler
          </h3>
        </div>
        <div className="flex flex-col divide-y divide-border-subtle">
          {CATEGORIES.map((cat) => {
            const count = articleCounts[cat.slug] ?? 0;
            const dotColor = dotColorMap[cat.slug];
            return (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className="group flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${dotColor}`}
                  />
                  <span className="text-[13px] font-medium text-text-primary transition-colors group-hover:text-accent">
                    {cat.name}
                  </span>
                </div>
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-text-tertiary">
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Newsletter Widget ── */}
      <div className="rounded-xl bg-surface-1 p-5">
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
          Bülten
        </div>
        <h3 className="font-display text-base font-bold text-text-primary">
          Teknoloji gündemini kaçırmayın
        </h3>
        <p className="mt-1 text-[12px] leading-relaxed text-text-tertiary">
          Her hafta en önemli gelişmeler kutunuzda.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <input
            type="email"
            placeholder="E-posta adresiniz"
            className="h-9 rounded-lg border border-border-medium bg-surface-0 px-3 text-[13px] text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
          />
          <button className="h-9 rounded-lg bg-accent text-[13px] font-semibold text-text-inverse transition-colors hover:bg-accent-light">
            Abone Ol
          </button>
        </div>
      </div>
    </aside>
  );
}
