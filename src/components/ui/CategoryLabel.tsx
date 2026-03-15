import type { CategorySlug } from "@/types/article";
import { CATEGORY_MAP } from "@/lib/constants";
import Link from "next/link";

const dotColorMap: Record<CategorySlug, string> = {
  "yapay-zeka": "bg-cat-ai",
  startup: "bg-cat-startup",
  "big-tech": "bg-cat-bigtech",
  yazilim: "bg-cat-yazilim",
  donanim: "bg-cat-donanim",
};

interface CategoryLabelProps {
  category: CategorySlug;
  linked?: boolean;
  className?: string;
}

export function CategoryLabel({
  category,
  linked = true,
  className = "",
}: CategoryLabelProps) {
  const cat = CATEGORY_MAP.get(category);
  const dotColor = dotColorMap[category];

  const content = (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-text-tertiary ${className}`}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {cat?.name ?? category}
    </span>
  );

  if (linked) {
    return (
      <Link
        href={`/kategori/${category}`}
        className="transition-colors hover:text-text-secondary"
      >
        {content}
      </Link>
    );
  }

  return content;
}
