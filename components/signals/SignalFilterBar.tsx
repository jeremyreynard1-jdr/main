"use client";

import {
  signalCategories,
  type SignalCategory,
  type SignalImpact,
} from "@/src/data/signals";
import { cn } from "@/lib/cn";

const impacts: SignalImpact[] = ["Monitor", "Act", "Escalate"];

export function SignalFilterBar({
  category,
  onCategory,
  impact,
  onImpact,
  query,
  onQuery,
  total,
  showing,
}: {
  category: SignalCategory | "all";
  onCategory: (c: SignalCategory | "all") => void;
  impact: SignalImpact | "all";
  onImpact: (i: SignalImpact | "all") => void;
  query: string;
  onQuery: (q: string) => void;
  total: number;
  showing: number;
}) {
  return (
    <div className="mt-6 space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategory("all")}
          className={cn(
            "rounded-full border px-3 py-1 text-[11.5px] font-medium transition",
            category === "all"
              ? "border-gold/50 bg-gold-soft text-gold"
              : "border-border bg-surface text-ink-muted hover:text-ink"
          )}
        >
          All sources
        </button>
        {signalCategories.map((c) => (
          <button
            key={c}
            onClick={() => onCategory(c)}
            className={cn(
              "rounded-full border px-3 py-1 text-[11.5px] font-medium transition",
              category === c
                ? "border-gold/50 bg-gold-soft text-gold"
                : "border-border bg-surface text-ink-muted hover:text-ink"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">
          Impact
        </span>
        <button
          onClick={() => onImpact("all")}
          className={cn(
            "rounded-full border px-3 py-1 text-[11.5px] font-medium transition",
            impact === "all"
              ? "border-gold/50 bg-gold-soft text-gold"
              : "border-border bg-surface text-ink-muted hover:text-ink"
          )}
        >
          Any
        </button>
        {impacts.map((i) => (
          <button
            key={i}
            onClick={() => onImpact(i)}
            className={cn(
              "rounded-full border px-3 py-1 text-[11.5px] font-medium transition",
              impact === i
                ? "border-gold/50 bg-gold-soft text-gold"
                : "border-border bg-surface text-ink-muted hover:text-ink"
            )}
          >
            {i}
          </button>
        ))}

        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search signals…"
          className="ml-auto w-full rounded-full border border-border bg-surface px-3 py-1.5 text-[12px] text-ink placeholder:text-ink-muted/70 focus:border-gold/50 focus:outline-none md:w-64"
        />
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">
          {showing}/{total}
        </span>
      </div>
    </div>
  );
}
