import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const articleStatusEnum = pgEnum("article_status", [
  "draft",
  "published",
]);

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  coverImage: text("cover_image").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  readingTime: integer("reading_time").default(5),
  author: text("author").default("TeknoDergi"),
  tags: text("tags").array().default([]),
  featured: boolean("featured").default(false),
  status: articleStatusEnum("status").default("draft"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type DbArticle = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
