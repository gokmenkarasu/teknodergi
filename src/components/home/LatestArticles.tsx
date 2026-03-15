"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article, CategorySlug } from "@/types/article";
import { CATEGORIES } from "@/lib/constants";
import { CategoryLabel } from "../ui/CategoryLabel";
import { timeAgo } from "@/lib/utils";

interface LatestArticlesProps {
  articles: Article[];
}

/**
 * PaperMag-inspired "What's New" section with tabbed category filtering.
 * Tabs: Tümü + each category.
 * Articles displayed as horizontal cards (image left + text right).
 */
export function LatestArticles({ articles }: LatestArticlesProps) {
  const [activeTab, setActiveTab] = useState<"all" | CategorySlug>("all");

  const filtered =
    activeTab === "all"
      ? articles
      : articles.filter((a) => a.category === activeTab);

  return (
    <section>
      {/* Section header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="h-3 w-0.5 bg-accent" />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-tertiary">
          Tüm Haberler
        </h2>
        <div className="h-px flex-1 bg-border-subtle" />
      </div>

      {/* Tab bar */}
      <div className="scrollbar-hide mb-6 flex gap-1 overflow-x-auto border-b border-border-subtle pb-px">
        <TabButton
          active={activeTab === "all"}
          onClick={() => setActiveTab("all")}
        >
          Tümü
        </TabButton>
        {CATEGORIES.map((cat) => (
          <TabButton
            key={cat.slug}
            active={activeTab === cat.slug}
            onClick={() => setActiveTab(cat.slug)}
          >
            {cat.name}
          </TabButton>
        ))}
      </div>

      {/* Article list */}
      <div className="flex flex-col divide-y divide-border-subtle">
        {filtered.slice(0, 6).map((article) => (
          <Link
            key={article.slug}
            href={`/haber/${article.slug}`}
            className="group flex gap-4 py-4 first:pt-0 last:pb-0"
          >
            {/* Thumbnail */}
            <div className="relative hidden h-24 w-36 flex-shrink-0 overflow-hidden rounded-lg bg-surface-2 sm:block">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                sizes="144px"
              />
            </div>

            {/* Content */}
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <CategoryLabel
                category={article.category}
                linked={false}
                className="mb-1"
              />
              <h3 className="line-clamp-2 font-display text-[15px] font-bold leading-snug text-text-primary transition-colors group-hover:text-accent">
                {article.title}
              </h3>
              <p className="mt-1 line-clamp-1 text-[13px] leading-relaxed text-text-tertiary">
                {article.excerpt}
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-text-tertiary">
                <span className="font-medium text-text-secondary">
                  {article.author}
                </span>
                <span className="text-border-strong">·</span>
                <time dateTime={article.publishedAt}>
                  {timeAgo(article.publishedAt)}
                </time>
                <span className="text-border-strong">·</span>
                <span>{article.readingTime} dk</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap border-b-2 px-3 py-2 text-[12px] font-semibold transition-colors ${
        active
          ? "border-accent text-accent"
          : "border-transparent text-text-tertiary hover:text-text-secondary"
      }`}
    >
      {children}
    </button>
  );
}
