import { Container } from "@/components/layout/Container";
import { HeroArticle } from "@/components/home/HeroArticle";
import { ArticleGrid } from "@/components/home/ArticleGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getAllArticles, getFeaturedArticle } from "@/data/articles";
import { buildHomepageJsonLd } from "@/lib/seo";

export default function HomePage() {
  const featuredArticle = getFeaturedArticle();
  const allArticles = getAllArticles();
  const latestArticles = allArticles.filter(
    (a) => a.slug !== featuredArticle?.slug
  );

  const jsonLd = buildHomepageJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {featuredArticle && <HeroArticle article={featuredArticle} />}

      <Container className="py-10">
        <SectionHeader title="Son Haberler" />
        <ArticleGrid articles={latestArticles} />
      </Container>
    </>
  );
}
