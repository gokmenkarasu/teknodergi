import Link from "next/link";
import { Container } from "./Container";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-surface-0">
      <Container className="py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              className="font-display text-lg font-extrabold text-text-primary"
            >
              Tekno<span className="text-accent">Dergi</span>
            </Link>
            <p className="mt-2 text-xs leading-relaxed text-text-tertiary">
              Teknoloji dünyasından güncel haberler ve analizler.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-text-tertiary">
              Kategoriler
            </h3>
            <ul className="space-y-1.5">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/kategori/${cat.slug}`}
                    className="text-xs text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-text-tertiary">
              Hakkımızda
            </h3>
            <ul className="space-y-1.5">
              <li>
                <span className="text-xs text-text-secondary">Hakkımızda</span>
              </li>
              <li>
                <span className="text-xs text-text-secondary">İletişim</span>
              </li>
              <li>
                <span className="text-xs text-text-secondary">
                  Yayın Politikası
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-text-tertiary">
              Takip
            </h3>
            <ul className="space-y-1.5">
              <li>
                <span className="text-xs text-text-secondary">Twitter / X</span>
              </li>
              <li>
                <span className="text-xs text-text-secondary">LinkedIn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border-subtle pt-4 text-[11px] text-text-tertiary">
          &copy; {new Date().getFullYear()} {SITE_NAME}
        </div>
      </Container>
    </footer>
  );
}
