import { Container } from "../layout/Container";

export function NewsletterCTA() {
  return (
    <section className="border-y border-border-subtle bg-surface-1/50 py-10 lg:py-14">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            Bülten
          </div>
          <h2 className="font-display text-xl font-bold text-text-primary sm:text-2xl">
            Teknoloji gündemini kaçırmayın
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Her hafta en önemli gelişmeler ve analizler kutunuzda.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="h-10 rounded border border-border-medium bg-surface-0 px-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
            />
            <button className="h-10 rounded bg-accent px-5 text-sm font-semibold text-text-inverse transition-colors hover:bg-accent-light">
              Abone Ol
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
