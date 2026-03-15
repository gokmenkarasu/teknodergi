"use client";

import { useState, useTransition } from "react";
import {
  searchFreepikImages,
  type FreepikImage,
} from "@/lib/actions/freepik-action";

interface FreepikPickerProps {
  onSelect: (url: string) => void;
  suggestedQuery?: string;
}

export function FreepikPicker({ onSelect, suggestedQuery }: FreepikPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(suggestedQuery ?? "");
  const [images, setImages] = useState<FreepikImage[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    setError("");
    startTransition(async () => {
      try {
        const results = await searchFreepikImages(query.trim());
        setImages(results);
        if (results.length === 0) setError("Sonuc bulunamadi");
      } catch {
        setError("Arama sirasinda hata olustu");
      }
    });
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          if (suggestedQuery && !images.length) {
            setQuery(suggestedQuery);
          }
        }}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-accent/40 bg-accent/5 px-4 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        Freepik&apos;ten Gorsel Ara
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-accent/30 bg-surface-0 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-accent">Freepik Gorselleri</h4>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-text-tertiary hover:text-text-primary"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
          placeholder="technology, AI, startup..."
          className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder-text-tertiary focus:border-accent focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={isPending}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
        >
          {isPending ? "..." : "Ara"}
        </button>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {images.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => {
                onSelect(img.url);
                setIsOpen(false);
              }}
              className="group relative overflow-hidden rounded-lg border border-border hover:border-accent transition-colors"
            >
              <img
                src={img.thumbnailUrl}
                alt={img.title}
                className="aspect-video w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-medium text-white">Sec</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
