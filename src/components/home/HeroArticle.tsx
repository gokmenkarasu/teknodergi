import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types/article";
import { Badge } from "../ui/Badge";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Clock } from "lucide-react";

interface HeroArticleProps {
  article: Article;
}

export function HeroArticle({ article }: HeroArticleProps) {
  return (
    <section className="relative overflow-hidden bg-surface-2 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href={`/haber/${article.slug}`} className="group block">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <Badge category={article.category} className="mb-4" />
              <h1 className="mb-4 font-display text-3xl font-extrabold leading-tight text-text-primary sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>
              <p className="mb-6 text-lg leading-relaxed text-text-secondary">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 text-sm text-text-tertiary">
                  <time dateTime={article.publishedAt}>
                    {formatDate(article.publishedAt)}
                  </time>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {article.readingTime} dk okuma
                  </span>
                </div>
                <span className="ml-auto flex items-center gap-2 text-sm font-semibold text-accent transition-all group-hover:gap-3">
                  Devamını Oku
                  <ArrowRight size={16} />
                </span>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-surface-3">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
