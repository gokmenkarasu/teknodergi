import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types/article";
import { Badge } from "./Badge";
import { formatDate } from "@/lib/utils";
import { Clock } from "lucide-react";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/haber/${article.slug}`} className="group block">
      <article className="overflow-hidden rounded-xl border border-border-subtle bg-surface-1 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-border-medium hover:shadow-card-hover">
        <div className="relative aspect-video overflow-hidden bg-surface-2">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute left-3 top-3">
            <Badge category={article.category} />
          </div>
        </div>
        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 font-display text-lg font-bold leading-snug text-text-primary transition-colors group-hover:text-accent">
            {article.title}
          </h3>
          <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-text-secondary">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-text-tertiary">
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {article.readingTime} dk
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
