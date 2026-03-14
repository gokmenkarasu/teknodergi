import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/articles/ArticleForm";
import { getAdminArticleById } from "@/lib/db/queries";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: PageProps) {
  const { id } = await params;
  const article = await getAdminArticleById(Number(id));

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-text-primary">
        Makaleyi Duzenle
      </h1>
      <ArticleForm article={article} />
    </div>
  );
}
