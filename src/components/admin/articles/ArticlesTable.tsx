"use client";

import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { ArticleStatusBadge } from "./ArticleStatusBadge";
import { DeleteArticleButton } from "./DeleteArticleButton";
import { formatDateShort } from "@/lib/utils";
import { toggleArticleStatus } from "@/lib/actions/article-actions";
import type { AdminArticle } from "@/types/article";
import { CATEGORY_MAP } from "@/lib/constants";
import { useTransition } from "react";

interface ArticlesTableProps {
  articles: AdminArticle[];
}

function ToggleButton({ article }: { article: AdminArticle }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(async () => { await toggleArticleStatus(article.id); })}
      title={article.status === "published" ? "Taslaga Al" : "Yayinla"}
      className="rounded p-1.5 text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors disabled:opacity-50"
    >
      {article.status === "published" ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </button>
  );
}

export function ArticlesTable({ articles }: ArticlesTableProps) {
  if (articles.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface-1 p-8 text-center">
        <p className="text-text-secondary">Henuz makale bulunmuyor.</p>
        <Link
          href="/admin/articles/new"
          className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-light transition-colors"
        >
          Ilk Makaleyi Olustur
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface-1">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-5 py-3 font-medium text-text-secondary">Baslik</th>
            <th className="px-5 py-3 font-medium text-text-secondary">Kategori</th>
            <th className="px-5 py-3 font-medium text-text-secondary">Durum</th>
            <th className="px-5 py-3 font-medium text-text-secondary">Tarih</th>
            <th className="px-5 py-3 font-medium text-text-secondary">Islemler</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {articles.map((article) => {
            const category = CATEGORY_MAP.get(article.category as any);
            return (
              <tr key={article.id} className="hover:bg-surface-2/50 transition-colors">
                <td className="max-w-xs truncate px-5 py-3 font-medium text-text-primary">
                  {article.title}
                </td>
                <td className="px-5 py-3 text-text-secondary">
                  {category?.name ?? article.category}
                </td>
                <td className="px-5 py-3">
                  <ArticleStatusBadge status={article.status} />
                </td>
                <td className="px-5 py-3 text-text-tertiary">
                  {formatDateShort(article.updatedAt)}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="rounded p-1.5 text-text-secondary hover:bg-surface-2 hover:text-accent transition-colors"
                      title="Duzenle"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <ToggleButton article={article} />
                    <DeleteArticleButton id={article.id} title={article.title} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
