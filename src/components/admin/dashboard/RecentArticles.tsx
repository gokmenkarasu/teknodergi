import Link from "next/link";
import { formatDateShort } from "@/lib/utils";
import { ArticleStatusBadge } from "@/components/admin/articles/ArticleStatusBadge";
import type { AdminArticle } from "@/types/article";

interface RecentArticlesProps {
  articles: AdminArticle[];
}

export function RecentArticles({ articles }: RecentArticlesProps) {
  return (
    <div className="rounded-xl border border-border bg-surface-1">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Son Makaleler
        </h2>
        <Link
          href="/admin/articles"
          className="text-sm text-accent hover:underline"
        >
          Tumunu Gor
        </Link>
      </div>
      <div className="divide-y divide-border">
        {articles.map((article) => (
          <div
            key={article.id}
            className="flex items-center justify-between px-5 py-3"
          >
            <div className="min-w-0 flex-1">
              <Link
                href={`/admin/articles/${article.id}/edit`}
                className="truncate text-sm font-medium text-text-primary hover:text-accent"
              >
                {article.title}
              </Link>
              <p className="text-xs text-text-tertiary">
                {formatDateShort(article.updatedAt)}
              </p>
            </div>
            <ArticleStatusBadge status={article.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
