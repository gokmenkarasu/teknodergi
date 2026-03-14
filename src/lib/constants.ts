import type { Category } from "@/types/article";

export const SITE_NAME = "TeknoDergi";
export const SITE_DESCRIPTION = "Teknoloji dünyasından en güncel haberler, analizler ve yorumlar.";
export const SITE_URL = "https://teknodergi.com";

export const CATEGORIES: readonly Category[] = [
  {
    slug: "yapay-zeka",
    name: "Yapay Zeka",
    description: "Yapay zeka, makine öğrenimi ve derin öğrenme alanındaki son gelişmeler.",
    color: "cat-ai",
  },
  {
    slug: "startup",
    name: "Startup",
    description: "Türkiye ve dünyadan startup haberleri, yatırımlar ve girişimcilik.",
    color: "cat-startup",
  },
  {
    slug: "big-tech",
    name: "Big Tech",
    description: "Apple, Google, Microsoft, Meta ve diğer teknoloji devlerinden haberler.",
    color: "cat-bigtech",
  },
  {
    slug: "yazilim",
    name: "Yazılım",
    description: "Programlama dilleri, framework'ler, araçlar ve yazılım mühendisliği.",
    color: "cat-yazilim",
  },
  {
    slug: "donanim",
    name: "Donanım",
    description: "İşlemciler, ekran kartları, telefonlar ve diğer donanım incelemeleri.",
    color: "cat-donanim",
  },
] as const;

export const CATEGORY_MAP = new Map(
  CATEGORIES.map((c) => [c.slug, c])
);
