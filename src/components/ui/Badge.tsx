import type { CategorySlug } from "@/types/article";
import { CATEGORY_MAP } from "@/lib/constants";

const colorMap: Record<CategorySlug, string> = {
  "yapay-zeka": "bg-cat-ai/15 text-cat-ai",
  startup: "bg-cat-startup/15 text-cat-startup",
  "big-tech": "bg-cat-bigtech/15 text-cat-bigtech",
  yazilim: "bg-cat-yazilim/15 text-cat-yazilim",
  donanim: "bg-cat-donanim/15 text-cat-donanim",
  mobilite: "bg-cat-donanim/15 text-cat-donanim",
};

interface BadgeProps {
  category: CategorySlug;
  className?: string;
}

export function Badge({ category, className = "" }: BadgeProps) {
  const cat = CATEGORY_MAP.get(category);
  const colors = colorMap[category];

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${colors} ${className}`}
    >
      {cat?.name ?? category}
    </span>
  );
}
