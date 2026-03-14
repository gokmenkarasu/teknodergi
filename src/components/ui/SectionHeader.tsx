import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  href?: string;
  linkText?: string;
}

export function SectionHeader({
  title,
  href,
  linkText = "Tümünü Gör",
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between border-b border-border-subtle pb-3">
      <h2 className="font-display text-xl font-bold text-text-primary sm:text-2xl">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-light"
        >
          {linkText}
          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}
