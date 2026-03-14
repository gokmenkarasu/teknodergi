import type { Article } from "@/types/article";
import { SectionHeader } from "../ui/SectionHeader";
import { ArticleCard } from "../ui/ArticleCard";

interface RelatedArticlesProps {
  articles: readonly Article[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border-subtle pt-8">
      <SectionHeader title="İlgili Haberler" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
