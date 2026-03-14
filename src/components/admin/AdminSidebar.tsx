"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  LogOut,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Makaleler", icon: FileText },
  { href: "/admin/articles/new", label: "Yeni Makale", icon: PlusCircle },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-surface-1">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
          <span className="text-sm font-bold text-white">T</span>
        </div>
        <span className="font-display text-lg font-bold text-text-primary">
          Admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors"
        >
          <Home className="h-5 w-5" />
          Siteye Git
        </Link>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-2 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Cikis Yap
          </button>
        </form>
      </div>
    </aside>
  );
}
