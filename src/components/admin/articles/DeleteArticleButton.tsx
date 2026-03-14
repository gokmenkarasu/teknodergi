"use client";

import { Trash2 } from "lucide-react";
import { deleteArticle } from "@/lib/actions/article-actions";
import { useTransition } from "react";

interface DeleteArticleButtonProps {
  id: number;
  title: string;
}

export function DeleteArticleButton({ id, title }: DeleteArticleButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`"${title}" makalesini silmek istediginize emin misiniz?`)) {
      return;
    }
    startTransition(async () => { await deleteArticle(id); });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      title="Sil"
      className="rounded p-1.5 text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
