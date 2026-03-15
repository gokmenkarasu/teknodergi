import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types/article";
import { CategoryLabel } from "../ui/CategoryLabel";
import { formatDate, timeAgo } from "@/lib/utils";
import { Container } from "../layout/Container";

interface EditorialWireProps {
  primary: Article;
  secondary: Article;
  headlines: Article[];
}

/**
 * 3-column asymmetric newspaper layout — refined.
 * Each column has a genuinely different structure.
 * Accent-colored section label, tighter visual rhythm,
 * headline column gets a subtle "daha fazla" anchor at bottom.
 */
export function EditorialWire({
  primary,
  secondary,
  headlines,
}: EditorialWireProps) {
  return (
    <section className="border-b border-border-subtle py-8 lg:py-10">
      <Container>
        {/* Section header with accent marker */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-3 w-0.5 bg-accent" />
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-tertiary">
            Editörün Seçimi
          </h2>
          <div className="h-px flex-1 bg-border-subtle" />
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-0">
          {/* Col 1 — Primary: image + text, generous space */}
          <div className="lg:col-span-5 lg:border-r lg:border-border-subtle lg:pr-6">
            <Link href={`/haber/${primary.slug}`} className="group block">
              <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-lg bg-surface-2">
                <Image
                  src={primary.coverImage}
                  alt={primary.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              </div>
              <CategoryLabel
                category={primary.category}
                linked={false}
                className="mb-2"
              />
              <h3 className="font-display text-xl font-bold leading-snug text-text-primary transition-colors group-hover:text-accent">
                {primary.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary">
                {primary.excerpt}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-text-tertiary">
                <span className="font-medium text-text-secondary">
                  {primary.author}
                </span>
                <span className="text-border-strong">·</span>
                <time dateTime={primary.publishedAt}>
                  {timeAgo(primary.publishedAt)}
                </time>
              </div>
            </Link>
          </div>

          {/* Col 2 — Secondary: compact image story, different aspect ratio for rhythm */}
          <div className="lg:col-span-4 lg:border-r lg:border-border-subtle lg:px-6">
            <Link href={`/haber/${secondary.slug}`} className="group block">
              <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded bg-surface-2">
                <Image
                  src={secondary.coverImage}
                  alt={secondary.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <CategoryLabel
                category={secondary.category}
                linked={false}
                className="mb-1.5"
              />
              <h3 className="font-display text-base font-bold leading-snug text-text-primary transition-colors group-hover:text-accent">
                {secondary.title}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-text-secondary">
                {secondary.excerpt}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-text-tertiary">
                <time dateTime={secondary.publishedAt}>
                  {timeAgo(secondary.publishedAt)}
                </time>
                <span className="text-border-strong">·</span>
                <span>{secondary.readingTime} dk</span>
              </div>
            </Link>
          </div>

          {/* Col 3 — Dense headline wire: accent top-border per item for visual punctuation */}
          <div className="flex flex-col lg:col-span-3 lg:pl-6">
            {headlines.slice(0, 4).map((item, i) => (
              <Link
                key={item.slug}
                href={`/haber/${item.slug}`}
                className={`group block py-3 first:pt-0 last:pb-0 ${
                  i > 0 ? "border-t border-border-subtle" : ""
                }`}
              >
                <CategoryLabel
                  category={item.category}
                  linked={false}
                  className="mb-1"
                />
                <h4 className="line-clamp-2 text-[13px] font-semibold leading-snug text-text-primary transition-colors group-hover:text-accent">
                  {item.title}
                </h4>
                <time
                  dateTime={item.publishedAt}
                  className="mt-1 block text-[11px] text-text-tertiary"
                >
                  {timeAgo(item.publishedAt)}
                </time>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
