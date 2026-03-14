import { ArticleForm } from "@/components/admin/articles/ArticleForm";

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-text-primary">
        Yeni Makale
      </h1>
      <ArticleForm />
    </div>
  );
}
