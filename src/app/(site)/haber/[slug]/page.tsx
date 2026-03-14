import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { ArticleContent } from "@/components/article/ArticleContent";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import {
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/db/queries";
import { buildArticleJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      images: [article.coverImage],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = await getRelatedArticles(article);
  const jsonLd = buildArticleJsonLd(article);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container className="py-8">
        <article className="mx-auto max-w-4xl">
          <ArticleHeader article={article} />
          <ArticleContent content={article.content} />
        </article>

        <div className="mx-auto max-w-4xl">
          <RelatedArticles articles={related} />
        </div>
      </Container>
    </>
  );
}
