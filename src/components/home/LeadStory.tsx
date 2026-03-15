import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types/article";
import { CategoryLabel } from "../ui/CategoryLabel";
import { formatDate, timeAgo } from "@/lib/utils";
import { Container } from "../layout/Container";

interface LeadStoryProps {
  article: Article;
  supporting: Article[];
}

/**
 * Headline-first lead story — editorial priority over visual showcase.
 * Refined: headline slightly pulled back for balance, supporting wire
 * gains reading time + numbered order for clearer scanning logic.
 */
export function LeadStory({ article, supporting }: LeadStoryProps) {
  return (
    <section className="border-b border-border-subtle py-8 lg:py-10">
      <Container>
        {/* Lead Story */}
        <Link href={`/haber/${article.slug}`} className="group block">
          <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-10">
            {/* Text — the star, but balanced */}
            <div className="flex flex-col justify-center lg:col-span-5 lg:py-2">
              <CategoryLabel
                category={article.category}
                linked={false}
                className="mb-3"
              />
              <h1 className="font-display text-[1.625rem] font-extrabold leading-[1.15] tracking-tight text-text-primary sm:text-[1.875rem] lg:text-[2.25rem]">
                {article.title}
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
                {article.excerpt}
              </p>
              <div className="mt-5 flex items-center gap-3 text-xs text-text-tertiary">
                <span className="font-medium text-text-secondary">
                  {article.author}
                </span>
                <span className="text-border-strong">/</span>
                <time dateTime={article.publishedAt}>
                  {timeAgo(article.publishedAt)}
                </time>
                <span className="text-border-strong">/</span>
                <span>{article.readingTime} dk okuma</span>
              </div>
            </div>

            {/* Image — supports the headline, given more space */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-surface-2">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority
                />
              </div>
            </div>
          </div>
        </Link>

        {/* Supporting wire — numbered for scanning, with reading time for differentiation */}
        {supporting.length > 0 && (
          <div className="mt-7 grid grid-cols-1 gap-0 border-t border-border-medium pt-5 sm:grid-cols-2 lg:grid-cols-3">
            {supporting.slice(0, 3).map((item, i) => (
              <Link
                key={item.slug}
                href={`/haber/${item.slug}`}
                className={`group flex gap-3 py-3 sm:px-5 sm:py-0 ${
                  i > 0
                    ? "border-t border-border-subtle sm:border-l sm:border-t-0"
                    : ""
                } sm:first:pl-0 sm:last:pr-0`}
              >
                {/* Numbered indicator for scanning hierarchy */}
                <span className="font-display text-lg font-black leading-none text-accent/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <CategoryLabel
                    category={item.category}
                    linked={false}
                    className="mb-1"
                  />
                  <h3 className="line-clamp-2 font-display text-[15px] font-bold leading-snug text-text-primary transition-colors group-hover:text-accent">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-text-tertiary">
                    <time dateTime={item.publishedAt}>
                      {timeAgo(item.publishedAt)}
                    </time>
                    <span className="text-border-strong">·</span>
                    <span>{item.readingTime} dk</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
