"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Container } from "./Container";
import { ThemeToggle } from "../ui/ThemeToggle";
import { MobileNav } from "./MobileNav";
import { CATEGORIES } from "@/lib/constants";
import {
  Menu,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

/* ── Breaking-news headlines (rotate through these) ── */
const TICKER_ITEMS = [
  { text: "Yapay zeka sektöründe yeni rekor yatırımlar açıklandı", href: "/kategori/yapay-zeka" },
  { text: "Türkiye'nin ilk yerli çip fabrikası için geri sayım başladı", href: "/kategori/donanim" },
  { text: "OpenAI, yeni modeli ile geliştirici ekosistemini genişletiyor", href: "/kategori/yapay-zeka" },
  { text: "Apple Vision Pro Türkiye satışa çıkış tarihi belli oldu", href: "/kategori/big-tech" },
];

/* ── Typewriter ticker ── */
function TickerTypewriter({
  items,
  currentIndex,
}: {
  items: typeof TICKER_ITEMS;
  currentIndex: number;
}) {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = items[currentIndex].text;
  const href = items[currentIndex].href;

  // Typing effect
  useEffect(() => {
    setDisplayText("");
    let charIndex = 0;
    const timer = setInterval(() => {
      charIndex++;
      setDisplayText(fullText.slice(0, charIndex));
      if (charIndex >= fullText.length) {
        clearInterval(timer);
      }
    }, 35);
    return () => clearInterval(timer);
  }, [fullText]);

  // Blinking cursor
  useEffect(() => {
    const timer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(timer);
  }, []);

  return (
    <Link
      href={href}
      className="truncate text-text-secondary transition-colors hover:text-text-primary"
    >
      {displayText}
      <span className={`${showCursor ? "opacity-100" : "opacity-0"} transition-opacity`}>
        _
      </span>
    </Link>
  );
}

/* ── Social icons (lightweight inline SVGs) ── */
function SocialIcons() {
  return (
    <div className="hidden items-center gap-2.5 text-text-tertiary lg:flex">
      <a href="#" aria-label="X (Twitter)" className="transition-colors hover:text-text-primary">
        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
      </a>
      <a href="#" aria-label="Instagram" className="transition-colors hover:text-text-primary">
        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
      </a>
      <a href="#" aria-label="YouTube" className="transition-colors hover:text-text-primary">
        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
      </a>
    </div>
  );
}

/* ── Weather widget ── */
function WeatherWidget() {
  const [weather, setWeather] = useState<{
    city: string;
    temp: number;
    icon: string;
  } | null>(null);

  useEffect(() => {
    async function fetchWeather(lat?: number, lon?: number) {
      try {
        const params = lat && lon ? `?lat=${lat}&lon=${lon}` : "";
        const res = await fetch(`/api/weather${params}`);
        const data = await res.json();
        setWeather(data);
      } catch {
        setWeather({ city: "Istanbul", temp: 15, icon: "☀️" });
      }
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(),
        { timeout: 3000 }
      );
    } else {
      fetchWeather();
    }
  }, []);

  if (!weather) return null;

  return (
    <div className="hidden items-center gap-1.5 text-sm text-text-secondary lg:flex">
      <span>{weather.icon}</span>
      <span className="font-medium">{weather.city}</span>
      <span className="font-bold text-text-primary">{weather.temp}°C</span>
    </div>
  );
}

/* ── Main Header ── */
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // Auto-rotate ticker (wait for typing to finish + pause)
  useEffect(() => {
    const currentText = TICKER_ITEMS[tickerIndex].text;
    const typingDuration = currentText.length * 35;
    const timeout = setTimeout(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_ITEMS.length);
    }, typingDuration + 3000); // typing time + 3s pause
    return () => clearTimeout(timeout);
  }, [tickerIndex]);

  const prevTicker = useCallback(() => {
    setTickerIndex(
      (prev) => (prev - 1 + TICKER_ITEMS.length) % TICKER_ITEMS.length
    );
  }, []);

  const nextTicker = useCallback(() => {
    setTickerIndex((prev) => (prev + 1) % TICKER_ITEMS.length);
  }, []);

  // Format Turkish date
  const today = new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* ═══════ 0. ACCENT STRIP ═══════ */}
      <div className="h-1 bg-gradient-to-r from-accent via-purple-500 to-accent" />

      {/* ═══════ 1. TOP TICKER BAR ═══════ */}
      <div className="border-b border-border-subtle bg-surface-0 text-xs">
        <Container className="flex h-9 items-center justify-between gap-4">
          {/* Date */}
          <span className="hidden shrink-0 text-text-tertiary sm:block">
            {today}
          </span>

          {/* Breaking news ticker */}
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="shrink-0 rounded bg-red-600 px-2 py-0.5 text-[11px] font-bold uppercase text-white">
              Son Dakika
            </span>
            <TickerTypewriter items={TICKER_ITEMS} currentIndex={tickerIndex} />
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                onClick={prevTicker}
                className="rounded p-0.5 text-text-tertiary transition-colors hover:text-text-primary"
                aria-label="Önceki haber"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={nextTicker}
                className="rounded p-0.5 text-text-tertiary transition-colors hover:text-text-primary"
                aria-label="Sonraki haber"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Social icons */}
          <SocialIcons />
        </Container>
      </div>

      {/* ═══════ 2. LOGO + BANNER ═══════ */}
      <div className="border-b border-border-subtle bg-surface-0 py-4">
        <Container className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl"
          >
            Tekno<span className="text-accent">Dergi</span>
          </Link>

          {/* 728x90 dummy banner */}
          <div className="hidden items-center justify-center rounded-lg border border-border-subtle bg-surface-2 lg:flex"
               style={{ width: 728, height: 90 }}>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                Reklam Alanı
              </p>
              <p className="text-[10px] text-text-tertiary">728 × 90</p>
            </div>
          </div>
        </Container>
      </div>

      {/* ═══════ 3. NAVIGATION BAR ═══════ */}
      <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface-1 shadow-sm">
        <Container className="flex h-11 items-center justify-between">
          {/* Nav links */}
          <nav className="flex items-center gap-0">
            {/* Home link */}
            <Link
              href="/"
              className={`flex h-11 items-center px-4 text-[13px] font-bold uppercase tracking-wide transition-colors ${
                pathname === "/"
                  ? "bg-accent text-white"
                  : "text-text-primary hover:bg-surface-2"
              }`}
            >
              Ana Sayfa
            </Link>

            {/* Category links */}
            {CATEGORIES.map((cat) => {
              const href = `/kategori/${cat.slug}`;
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={cat.slug}
                  href={href}
                  className={`hidden h-11 items-center px-3.5 text-[13px] font-semibold uppercase tracking-wide transition-colors md:flex ${
                    isActive
                      ? "bg-accent text-white"
                      : "text-text-primary hover:bg-surface-2"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side: weather, theme, search, mobile menu */}
          <div className="flex items-center gap-3">
            <WeatherWidget />

            <ThemeToggle />

            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex h-8 w-8 items-center justify-center rounded text-text-tertiary transition-colors hover:text-text-primary"
              aria-label="Ara"
            >
              {searchOpen ? <X size={16} /> : <Search size={16} />}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded text-text-tertiary transition-colors hover:text-text-primary md:hidden"
              aria-label="Menüyü aç"
            >
              <Menu size={18} />
            </button>
          </div>
        </Container>

        {/* Search dropdown */}
        {searchOpen && (
          <div className="border-t border-border-subtle bg-surface-1">
            <Container className="py-2.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchOpen(false);
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Haberlerde ara..."
                  className="flex-1 rounded-lg border border-border-subtle bg-surface-0 px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  autoFocus
                />
                <button
                  type="submit"
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                >
                  Ara
                </button>
              </form>
            </Container>
          </div>
        )}
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
