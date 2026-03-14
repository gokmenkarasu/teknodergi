import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mb-2 font-display text-6xl font-extrabold text-accent">
        404
      </h1>
      <h2 className="mb-4 font-display text-2xl font-bold text-text-primary">
        Sayfa Bulunamadı
      </h2>
      <p className="mb-8 max-w-md text-text-secondary">
        Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-text-inverse transition-colors hover:bg-accent-light"
      >
        Ana Sayfaya Dön
      </Link>
    </Container>
  );
}
