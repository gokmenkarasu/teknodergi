import { FileText, Globe, FilePen, Star } from "lucide-react";

interface StatsCardsProps {
  stats: {
    total: number;
    published: number;
    drafts: number;
    featured: number;
  };
}

const cards = [
  { key: "total", label: "Toplam Makale", icon: FileText, color: "text-accent" },
  { key: "published", label: "Yayinda", icon: Globe, color: "text-green-400" },
  { key: "drafts", label: "Taslak", icon: FilePen, color: "text-yellow-400" },
  { key: "featured", label: "One Cikan", icon: Star, color: "text-purple-400" },
] as const;

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="rounded-xl border border-border bg-surface-1 p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">{card.label}</p>
              <p className="mt-1 text-3xl font-bold text-text-primary">
                {stats[card.key]}
              </p>
            </div>
            <card.icon className={`h-8 w-8 ${card.color} opacity-60`} />
          </div>
        </div>
      ))}
    </div>
  );
}
