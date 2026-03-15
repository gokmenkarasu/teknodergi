import Link from "next/link";
import Image from "next/image";
import type { Article, CategorySlug } from "@/types/article";
import { CATEGORY_MAP } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import { Container } from "../layout/Container";

const accentBorderMap: Record<CategorySlug, string> = {
  "yapay-zeka": "border-l-cat-ai",
  startup: "border-l-cat-startup",
  "big-tech": "border-l-cat-bigtech",
  yazilim: "border-l-cat-yazilim",
  donanim: "border-l-cat-donanim",
  mobilite: "border-l-cat-donanim",
};

interface CategoryRiverProps {
  articlesByCategory: Record<CategorySlug, Article[]>;
}

/**
 * Category-grouped headlines — refined with thumbnail for lead item
 * in each category to break text monotony. Colored accents more prominent,
 * better rhythm with alternating density.
 */
export function CategoryRiver({ articlesByCategory }: CategoryRiverProps) {
  const categories = (
    Object.keys(articlesByCategory) as CategorySlug[]
  ).filter((slug) => articlesByCategory[slug].length > 0);

  if (categories.length === 0) return null;

  return (
    <section className="py-8 lg:py-10">
      <Container>
        <div className="mb-6 flex items-center gap-3">
          <div className="h-3 w-0.5 bg-accent" />
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-tertiary">
            Kategoriler
          </h2>
          <div className="h-px flex-1 bg-border-subtle" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-x-10 lg:gap-y-8">
          {categories.map((catSlug) => {
            const cat = CATEGORY_MAP.get(catSlug);
            const articles = articlesByCategory[catSlug];
            const borderClass = accentBorderMap[catSlug];

            return (
              <div
                key={catSlug}
                className={`border-l-2 ${borderClass} pl-4`}
              >
                {/* Category header */}
                <div className="mb-3 flex items-center justify-between">
                  <Link
                    href={`/kategori/${catSlug}`}
                    className="text-xs font-bold uppercase tracking-widest text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {cat?.name ?? catSlug}
                  </Link>
                  <Link
                    href={`/kategori/${catSlug}`}
                    className="text-[11px] text-text-tertiary transition-colors hover:text-accent"
                  >
                    Tümü →
                  </Link>
                </div>

                {/* All items — with thumbnail */}
                <div className="flex flex-col divide-y divide-border-subtle">
                  {articles.slice(0, 3).map((article) => (
                    <Link
                      key={article.slug}
                      href={`/haber/${article.slug}`}
                      className="group flex gap-3 py-2.5 first:pt-0 last:pb-0"
                    >
                      <div className="relative hidden h-16 w-24 flex-shrink-0 overflow-hidden rounded bg-surface-2 sm:block">
                        <Image
                          src={article.coverImage}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="line-clamp-2 text-[13px] font-semibold leading-snug text-text-primary transition-colors group-hover:text-accent">
                          {article.title}
                        </h4>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-text-tertiary">
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
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
