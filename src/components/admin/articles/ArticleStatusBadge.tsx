import { cn } from "@/lib/utils";
import type { ArticleStatus } from "@/types/article";

interface ArticleStatusBadgeProps {
  status: ArticleStatus;
}

export function ArticleStatusBadge({ status }: ArticleStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        status === "published"
          ? "bg-green-400/10 text-green-400"
          : "bg-yellow-400/10 text-yellow-400"
      )}
    >
      {status === "published" ? "Yayinda" : "Taslak"}
    </span>
  );
}
