import { HeroSection } from "@/components/home/HeroSection";
import { TopStories } from "@/components/home/TopStories";
import { LatestArticles } from "@/components/home/LatestArticles";
import { Sidebar } from "@/components/home/Sidebar";
import { Container } from "@/components/layout/Container";
import { getAllArticles } from "@/lib/db/queries";
import { buildHomepageJsonLd } from "@/lib/seo";
import { CATEGORIES } from "@/lib/constants";
import type { CategorySlug } from "@/types/article";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allArticles = await getAllArticles();

  if (allArticles.length === 0) return null;

  // ── Hero data
  const featured = allArticles.find((a) => a.featured) ?? allArticles[0];
  const trending = allArticles
    .filter((a) => a.slug !== featured.slug)
    .slice(0, 4);

  // ── Top Stories (next 4 after hero area)
  const usedSlugs = new Set([featured.slug, ...trending.map((a) => a.slug)]);
  const topStories = allArticles
    .filter((a) => !usedSlugs.has(a.slug))
    .slice(0, 4);

  // ── All articles for tabbed section
  const latestArticles = allArticles;

  // ── Sidebar data
  const popularArticles = allArticles.slice(0, 5);
  const articleCounts = {} as Record<CategorySlug, number>;
  for (const cat of CATEGORIES) {
    articleCounts[cat.slug] = allArticles.filter(
      (a) => a.category === cat.slug
    ).length;
  }

  const jsonLd = buildHomepageJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero — featured article with overlay + trending sidebar */}
      <HeroSection featured={featured} trending={trending} />

      {/* 2. Main content + Sidebar layout */}
      <Container className="py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Main content — 8/12 */}
          <div className="space-y-10 lg:col-span-8">
            <TopStories articles={topStories} />
            <LatestArticles articles={latestArticles} />
          </div>

          {/* Sidebar — 4/12 */}
          <div className="lg:col-span-4 lg:border-l lg:border-border-subtle lg:pl-8">
            <Sidebar
              popularArticles={popularArticles}
              articleCounts={articleCounts}
            />
          </div>
        </div>
      </Container>
    </>
  );
}
