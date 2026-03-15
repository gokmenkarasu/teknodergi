export type CategorySlug = "yapay-zeka" | "startup" | "big-tech" | "yazilim" | "donanim" | "mobilite";

export interface Category {
  readonly slug: CategorySlug;
  readonly name: string;
  readonly description: string;
  readonly color: string;
}

export interface Article {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly content: string;
  readonly category: CategorySlug;
  readonly coverImage: string;
  readonly publishedAt: string;
  readonly readingTime: number;
  readonly author: string;
  readonly tags: readonly string[];
  readonly featured?: boolean;
}

export type ArticleStatus = "draft" | "published";

export interface AdminArticle extends Article {
  readonly id: number;
  readonly status: ArticleStatus;
  readonly seoTitle: string | null;
  readonly seoDescription: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}
