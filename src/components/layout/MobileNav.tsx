"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <nav className="absolute right-0 top-0 flex h-full w-72 flex-col bg-surface-1 p-6 shadow-elevated">
        <div className="mb-8 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-text-primary">
            Kategoriler
          </span>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-2 hover:text-text-primary"
            aria-label="Menüyü kapat"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/kategori/${cat.slug}`}
              onClick={onClose}
              className="rounded-lg px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
