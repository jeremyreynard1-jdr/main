"use client";

import { type CompetitorTag } from "@/src/data/competitors";
import { cn } from "@/lib/cn";

const filters: { value: CompetitorTag; label: string }[] = [
  { value: "big-logos", label: "Big logos" },
  { value: "market-entry", label: "Market entry" },
  { value: "product-features", label: "Product" },
  { value: "pricing", label: "Pricing" },
  { value: "funding-hires", label: "Funding & hires" },
];

export function FilterBar({
  active,
  onToggle,
  onClear,
}: {
  active: CompetitorTag[];
  onToggle: (t: CompetitorTag) => void;
  onClear: () => void;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">
        Filter by signal
      </span>
      {filters.map((f) => {
        const on = active.includes(f.value);
        return (
          <button
            key={f.value}
            onClick={() => onToggle(f.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-[11.5px] font-medium transition",
              on
                ? "border-gold/50 bg-gold-soft text-gold"
                : "border-border bg-surface text-ink-muted hover:border-gold/30 hover:text-ink"
            )}
          >
            {f.label}
          </button>
        );
      })}
      {active.length > 0 && (
        <button
          onClick={onClear}
          className="ml-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted hover:text-gold"
        >
          Clear
        </button>
      )}
    </div>
  );
}
