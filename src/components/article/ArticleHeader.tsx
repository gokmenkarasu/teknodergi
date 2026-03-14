import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/article";
import { Badge } from "../ui/Badge";
import { formatDate } from "@/lib/utils";
import { Clock, ChevronRight } from "lucide-react";
import { CATEGORY_MAP } from "@/lib/constants";

interface ArticleHeaderProps {
  article: Article;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  const category = CATEGORY_MAP.get(article.category);

  return (
    <header className="mb-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-text-tertiary">
        <Link href="/" className="hover:text-accent">
          Ana Sayfa
        </Link>
        <ChevronRight size={14} />
        <Link
          href={`/kategori/${article.category}`}
          className="hover:text-accent"
        >
          {category?.name ?? article.category}
        </Link>
        <ChevronRight size={14} />
        <span className="line-clamp-1 text-text-secondary">{article.title}</span>
      </nav>

      <Badge category={article.category} className="mb-4" />

      <h1 className="mb-4 font-display text-3xl font-extrabold leading-tight text-text-primary sm:text-4xl">
        {article.title}
      </h1>

      <div className="mb-6 flex items-center gap-4 text-sm text-text-tertiary">
        <span className="font-medium text-text-secondary">{article.author}</span>
        <time dateTime={article.publishedAt}>
          {formatDate(article.publishedAt)}
        </time>
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {article.readingTime} dk okuma
        </span>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-xl bg-surface-2">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />
      </div>
    </header>
  );
}
