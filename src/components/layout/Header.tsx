"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "./Container";
import { ThemeToggle } from "../ui/ThemeToggle";
import { MobileNav } from "./MobileNav";
import { CATEGORIES } from "@/lib/constants";
import { Menu } from "lucide-react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border-subtle bg-header-bg/95 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-display text-xl font-extrabold tracking-tight text-text-primary"
          >
            Tekno<span className="text-accent">Dergi</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-text-secondary transition-colors hover:bg-surface-3 hover:text-accent md:hidden"
              aria-label="Menüyü aç"
            >
              <Menu size={18} />
            </button>
          </div>
        </Container>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
