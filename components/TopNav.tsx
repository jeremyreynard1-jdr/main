"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const tabs = [
  { href: "/", label: "Launches" },
  { href: "/map", label: "Map" },
  { href: "/intel", label: "Intel" },
  { href: "/signals", label: "Signals" },
  { href: "/playbooks", label: "Playbooks" },
  { href: "/plan", label: "Plan" },
];

function StarMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 3 C16.4 9.5 22.5 15.6 29 16 C22.5 16.4 16.4 22.5 16 29 C15.6 22.5 9.5 16.4 3 16 C9.5 15.6 15.6 9.5 16 3 Z" />
    </svg>
  );
}

export function TopNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-nav/95 backdrop-blur text-ink">
      <div className="mx-auto flex max-w-7xl items-stretch gap-6 overflow-x-auto px-4 nav-scroll md:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 py-4 leading-none"
        >
          <StarMark className="size-4 text-gold" />
          <span className="font-display text-[18px] tracking-tight text-ink">
            Expansion Center
          </span>
        </Link>
        <nav className="flex items-stretch gap-1 md:gap-3">
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
                  "relative flex items-center px-3 text-[13.5px] font-medium text-ink-muted transition hover:text-ink",
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
