import Link from "next/link";
import type { Article, CategorySlug } from "@/types/article";
import { Container } from "../layout/Container";

const accentTextMap: Record<CategorySlug, string> = {
  "yapay-zeka": "text-cat-ai",
  startup: "text-cat-startup",
  "big-tech": "text-cat-bigtech",
  yazilim: "text-cat-yazilim",
  donanim: "text-cat-donanim",
  mobilite: "text-cat-donanim",
};

interface MostReadProps {
  articles: Article[];
}

/**
 * Numbered most-read strip — refined for more visual energy.
 * Numbers use category accent colors for brand character.
 * Items have hover background for interactive feel.
 * Desktop: 5 columns with stronger vertical dividers.
 */
export function MostRead({ articles }: MostReadProps) {
  if (articles.length === 0) return null;

  return (
    <section className="border-b border-border-subtle bg-surface-1/50 py-7 lg:py-8">
      <Container>
        <div className="mb-5 flex items-center gap-3">
          <div className="h-3 w-0.5 bg-accent" />
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            En Çok Okunan
          </h2>
          <div className="h-px flex-1 bg-border-subtle" />
        </div>

        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-5">
          {articles.slice(0, 5).map((article, i) => {
            const numColor = accentTextMap[article.category];
            return (
              <Link
                key={article.slug}
                href={`/haber/${article.slug}`}
                className={`group flex items-start gap-3 rounded-sm py-3 transition-colors hover:bg-surface-2/50 sm:flex-col sm:gap-0 sm:px-4 sm:py-3 lg:px-5 ${
                  i > 0
                    ? "border-t border-border-subtle sm:border-l sm:border-t-0"
                    : ""
                } sm:first:pl-0 sm:last:pr-0`}
              >
                {/* Number — category-colored for visual energy */}
                <span
                  className={`font-display text-[2rem] font-black leading-none sm:mb-2 sm:text-[2.5rem] ${numColor} opacity-40 transition-opacity group-hover:opacity-70`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-text-primary transition-colors group-hover:text-accent sm:text-sm">
                    {article.title}
                  </h3>
                  <span className="mt-1.5 block text-[11px] text-text-tertiary">
                    {article.readingTime} dk okuma
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
