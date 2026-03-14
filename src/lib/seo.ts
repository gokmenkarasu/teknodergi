import { SITE_NAME, SITE_URL } from "./constants";
import type { Article } from "@/types/article";
import { CATEGORY_MAP } from "./constants";

export function buildCanonicalUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

export function buildArticleJsonLd(article: Article) {
  const category = CATEGORY_MAP.get(article.category);
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: `${SITE_URL}${article.coverImage}`,
    datePublished: article.publishedAt,
    author: {
      "@type": "Organization",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": buildCanonicalUrl(`/haber/${article.slug}`),
    },
    articleSection: category?.name ?? article.category,
    inLanguage: "tr",
  };
}

export function buildHomepageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "tr",
    description: "Teknoloji dünyasından en güncel haberler, analizler ve yorumlar.",
  };
}
