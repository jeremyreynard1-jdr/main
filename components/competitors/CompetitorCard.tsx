"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { type Competitor, type CompetitorTag } from "@/src/data/competitors";
import { SourceLink } from "@/components/SourceLink";
import { IllustrativeChip } from "@/components/IllustrativeChip";
import { cn } from "@/lib/cn";

const threatTone: Record<Competitor["threat"], string> = {
  Direct: "bg-rag-red-soft/40 text-rag-red ring-1 ring-rag-red/30",
  Adjacent: "bg-rag-amber-soft/40 text-rag-amber ring-1 ring-rag-amber/30",
  Watch: "bg-surface-2 text-ink-muted ring-1 ring-border",
};

const tagLabels: Record<CompetitorTag, string> = {
  "big-logos": "Logos",
  "market-entry": "Market entry",
  "product-features": "Product",
  pricing: "Pricing",
  "funding-hires": "Funding & hires",
};

export function CompetitorCard({
  c,
  activeTags,
  onToggleCompare,
  comparing,
}: {
  c: Competitor;
  activeTags: CompetitorTag[];
  onToggleCompare: (id: string) => void;
  comparing: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const visibleFacts =
    activeTags.length === 0
      ? c.facts
      : c.facts.filter((f) => activeTags.includes(f.tag));

  return (
    <article className="rounded-card border border-border bg-surface p-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[18px] font-semibold tracking-tight text-ink">
              {c.name}
            </h3>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
                threatTone[c.threat]
              )}
            >
              {c.threat}
            </span>
          </div>
          <div className="mt-0.5 text-[12px] text-ink-muted">
            {c.positioning} · HQ: {c.hq}
            {c.founded && ` · founded ${c.founded}`}
          </div>
        </div>
        <button
          onClick={() => onToggleCompare(c.id)}
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition",
            comparing
              ? "border-gold/60 bg-gold-soft text-gold"
              : "border-border text-ink-muted hover:border-gold/40 hover:text-gold"
          )}
        >
          {comparing ? <Check size={11} strokeWidth={2.5} /> : <Plus size={11} strokeWidth={2.5} />}
          {comparing ? "Selected" : "Compare"}
        </button>
      </header>

      <p className="mt-3 text-[13.5px] leading-relaxed text-ink">{c.headline}</p>

      <div className="mt-4 space-y-2.5">
        {visibleFacts.slice(0, expanded ? 99 : 3).map((f) => (
          <div key={`${f.tag}:${f.text}`} className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-gold" />
              <div className="flex-1 text-[12.5px] leading-relaxed text-ink">
                {f.text}
              </div>
            </div>
            <div className="flex items-center gap-2 pl-4">
              <span className="rounded-full border border-border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
                {tagLabels[f.tag]}
              </span>
              {f.illustrative ? (
                <IllustrativeChip title="Estimate" />
              ) : f.source ? (
                <SourceLink href={f.source} />
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {visibleFacts.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-gold hover:text-gold-deep"
        >
          {expanded ? "Collapse" : `+ ${visibleFacts.length - 3} more facts`}
        </button>
      )}
    </article>
  );
}
