import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { ArticlesTable } from "@/components/admin/articles/ArticlesTable";
import { getAdminArticles } from "@/lib/db/queries";

export default async function ArticlesPage() {
  const articles = await getAdminArticles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Makaleler
        </h1>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-light transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Yeni Makale
        </Link>
      </div>
      <ArticlesTable articles={articles} />
    </div>
  );
}
