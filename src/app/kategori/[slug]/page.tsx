import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { ArticleGrid } from "@/components/home/ArticleGrid";
import { Badge } from "@/components/ui/Badge";
import { getArticlesByCategory } from "@/data/articles";
import { CATEGORIES, CATEGORY_MAP, SITE_NAME } from "@/lib/constants";
import type { CategorySlug } from "@/types/article";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORY_MAP.get(slug as CategorySlug);
  if (!category) return {};

  return {
    title: `${category.name} Haberleri`,
    description: category.description,
    openGraph: {
      title: `${category.name} Haberleri | ${SITE_NAME}`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = CATEGORY_MAP.get(slug as CategorySlug);

  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategory(category.slug);

  return (
    <Container className="py-10">
      <header className="mb-8">
        <Badge category={category.slug} className="mb-4" />
        <h1 className="mb-2 font-display text-3xl font-extrabold text-text-primary sm:text-4xl">
          {category.name} Haberleri
        </h1>
        <p className="text-text-secondary">{category.description}</p>
        <span className="mt-2 inline-block text-sm text-text-tertiary">
          {articles.length} haber
        </span>
      </header>

      {articles.length > 0 ? (
        <ArticleGrid articles={articles} />
      ) : (
        <p className="text-text-secondary">
          Bu kategoride henüz haber bulunmuyor.
        </p>
      )}
    </Container>
  );
}
