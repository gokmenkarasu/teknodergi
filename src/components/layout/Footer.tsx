import Link from "next/link";
import { Container } from "./Container";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border-subtle bg-surface-1">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="font-display text-xl font-extrabold text-text-primary"
            >
              Tekno<span className="text-accent">Dergi</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Teknoloji dünyasından en güncel haberler, derinlemesine analizler
              ve özgün yorumlar.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-tertiary">
              Kategoriler
            </h3>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/kategori/${cat.slug}`}
                    className="text-sm text-text-secondary transition-colors hover:text-accent"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-tertiary">
              Hakkımızda
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-text-secondary">Hakkımızda</span>
              </li>
              <li>
                <span className="text-sm text-text-secondary">İletişim</span>
              </li>
              <li>
                <span className="text-sm text-text-secondary">
                  Yayın Politikası
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-tertiary">
              Sosyal Medya
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-text-secondary">Twitter / X</span>
              </li>
              <li>
                <span className="text-sm text-text-secondary">LinkedIn</span>
              </li>
              <li>
                <span className="text-sm text-text-secondary">GitHub</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border-subtle pt-6 text-center text-xs text-text-tertiary">
          &copy; {new Date().getFullYear()} {SITE_NAME}. Tüm hakları saklıdır.
        </div>
      </Container>
    </footer>
  );
}
