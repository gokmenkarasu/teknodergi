import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types/article";
import { CategoryLabel } from "../ui/CategoryLabel";
import { timeAgo } from "@/lib/utils";

interface TopStoriesProps {
  articles: Article[];
}

/**
 * PaperMag-inspired top stories grid.
 * 2x2 card grid with images, category badges, titles, and metadata.
 * Used in the main content column.
 */
export function TopStories({ articles }: TopStoriesProps) {
  if (articles.length === 0) return null;

  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <div className="h-3 w-0.5 bg-accent" />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-tertiary">
          Son Haberler
        </h2>
        <div className="h-px flex-1 bg-border-subtle" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {articles.slice(0, 4).map((article) => (
          <Link
            key={article.slug}
            href={`/haber/${article.slug}`}
            className="group block"
          >
            <div className="relative mb-3 aspect-[16/10] overflow-hidden rounded-lg bg-surface-2">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
            <CategoryLabel
              category={article.category}
              linked={false}
              className="mb-1.5"
            />
            <h3 className="line-clamp-2 font-display text-[15px] font-bold leading-snug text-text-primary transition-colors group-hover:text-accent">
              {article.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-text-tertiary">
              {article.excerpt}
            </p>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-text-tertiary">
              <span className="font-medium text-text-secondary">
                {article.author}
              </span>
              <span className="text-border-strong">·</span>
              <time dateTime={article.publishedAt}>
                {timeAgo(article.publishedAt)}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
