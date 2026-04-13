"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";
import { cn } from "@/lib/cn";

const tabs = [
  { href: "/", label: "Launches" },
  { href: "/map", label: "Map" },
  { href: "/intel", label: "Intel" },
  { href: "/signals", label: "Signals" },
  { href: "/playbooks", label: "Playbooks" },
  { href: "/plan", label: "Plan" },
];

export function TopNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-nav/95 backdrop-blur text-ink">
      <div className="mx-auto flex max-w-7xl items-stretch gap-6 overflow-x-auto px-4 nav-scroll md:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 py-4 text-[15px] leading-none text-ink tracking-tight"
        >
          <Activity size={16} strokeWidth={2.25} className="text-gold" />
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            The
          </span>
          <span className="font-semibold tracking-tight">Expansion Index</span>
        </Link>
        <nav className="flex items-stretch gap-1 md:gap-2">
          {tabs.map((t) => {
            const active =
              t.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "relative flex items-center px-3 text-[13px] font-medium text-ink-muted transition hover:text-ink",
                  active && "text-ink"
                )}
              >
                {t.label}
                {active && (
                  <span className="absolute inset-x-3 bottom-0 h-[2px] bg-gold" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
