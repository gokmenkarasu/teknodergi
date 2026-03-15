import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types/article";
import { CategoryLabel } from "../ui/CategoryLabel";
import { timeAgo } from "@/lib/utils";
import { Container } from "../layout/Container";

interface HeroSectionProps {
  featured: Article;
  trending: Article[];
}

/**
 * Hero section: image on top, text below (Webrazzi style).
 * No overlay — works with any image regardless of content.
 * Right side: trending articles sidebar list.
 */
export function HeroSection({ featured, trending }: HeroSectionProps) {
  return (
    <section className="py-6 lg:py-8">
      <Container>
        <div className="grid items-start gap-6 lg:grid-cols-12">
          {/* ── Featured article — image top, text overlay ── */}
          <Link
            href={`/haber/${featured.slug}`}
            className="group lg:col-span-7"
          >
            {/* Image with overlay text */}
            <div className="relative aspect-[16/11] overflow-hidden rounded-xl bg-surface-2">
              <Image
                src={featured.coverImage}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Text on image */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6">
                <CategoryLabel
                  category={featured.category}
                  linked={false}
                  className="mb-2 !text-white/80"
                />
                <h1 className="font-display text-xl font-extrabold leading-tight text-white sm:text-2xl lg:text-[1.75rem]">
                  {featured.title}
                </h1>
                <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-white/70">
                  {featured.excerpt}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-white/50">
                  <span className="font-medium text-white/70">
                    {featured.author}
                  </span>
                  <span>·</span>
                  <time dateTime={featured.publishedAt}>
                    {timeAgo(featured.publishedAt)}
                  </time>
                  <span>·</span>
                  <span>{featured.readingTime} dk okuma</span>
                </div>
              </div>
            </div>
          </Link>

          {/* ── Trending sidebar — vertical stack ── */}
          <div className="flex flex-col lg:col-span-5">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
              Öne Çıkanlar
            </div>
            <div className="flex flex-1 flex-col gap-0 divide-y divide-border-subtle">
              {trending.slice(0, 4).map((article) => (
                <Link
                  key={article.slug}
                  href={`/haber/${article.slug}`}
                  className="group flex gap-3.5 py-3 first:pt-0 last:pb-0"
                >
                  {/* Thumbnail */}
                  <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-surface-2 sm:h-[88px] sm:w-32">
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      sizes="128px"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <CategoryLabel
                      category={article.category}
                      linked={false}
                      className="mb-1"
                    />
                    <h3 className="line-clamp-2 font-display text-[14px] font-bold leading-snug text-text-primary transition-colors group-hover:text-accent">
                      {article.title}
                    </h3>
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
        </div>
      </Container>
    </section>
  );
}
