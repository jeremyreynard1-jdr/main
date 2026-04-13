"use client";

import { X } from "lucide-react";
import { type Competitor } from "@/src/data/competitors";
import { SourceLink } from "@/components/SourceLink";
import { IllustrativeChip } from "@/components/IllustrativeChip";

const rows: { key: keyof Competitor | "facts"; label: string }[] = [
  { key: "positioning", label: "Positioning" },
  { key: "threat", label: "Threat" },
  { key: "hq", label: "HQ" },
  { key: "founded", label: "Founded" },
];

const tagGroups: { key: string; label: string }[] = [
  { key: "big-logos", label: "Big logos" },
  { key: "market-entry", label: "Market entry" },
  { key: "product-features", label: "Product" },
  { key: "pricing", label: "Pricing" },
  { key: "funding-hires", label: "Funding & hires" },
];

export function CompareTray({
  selected,
  onRemove,
  onClear,
}: {
  selected: Competitor[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  if (selected.length === 0) return null;

  return (
    <section className="mt-10 rounded-card border border-border bg-bg-alt p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold">
            Side-by-side compare
          </div>
          <h2 className="mt-1 font-display text-[22px]">
            {selected.length < 2
              ? "Pick one more to compare"
              : `${selected.map((s) => s.name).join(" vs ")}`}
          </h2>
        </div>
        <button
          onClick={onClear}
          className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted hover:text-gold"
        >
          Clear
        </button>
      </div>

      {selected.length >= 2 && (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-[12.5px]">
            <thead>
              <tr className="border-b border-border">
                <th className="w-40 py-2 pr-4 text-left font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">
                  Attribute
                </th>
                {selected.map((c) => (
                  <th key={c.id} className="px-3 py-2 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-[16px] text-ink">
                        {c.name}
                      </span>
                      <button
                        onClick={() => onRemove(c.id)}
                        className="text-ink-muted hover:text-gold"
                        aria-label={`Remove ${c.name}`}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key as string} className="border-b border-border/60 align-top">
                  <td className="py-3 pr-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">
                    {r.label}
                  </td>
                  {selected.map((c) => (
                    <td key={c.id} className="px-3 py-3 text-ink">
                      {(c[r.key as keyof Competitor] as string) || "—"}
                    </td>
                  ))}
                </tr>
              ))}
              {tagGroups.map((g) => (
                <tr key={g.key} className="border-b border-border/60 align-top">
                  <td className="py-3 pr-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">
                    {g.label}
                  </td>
                  {selected.map((c) => {
                    const facts = c.facts.filter((f) => f.tag === g.key);
                    return (
                      <td key={c.id} className="px-3 py-3">
                        {facts.length === 0 ? (
                          <span className="text-ink-muted">—</span>
                        ) : (
                          <ul className="space-y-2">
                            {facts.map((f, i) => (
                              <li key={i} className="text-ink">
                                <div>{f.text}</div>
                                <div className="mt-1">
                                  {f.illustrative ? (
                                    <IllustrativeChip title="Estimate" />
                                  ) : f.source ? (
                                    <SourceLink href={f.source} />
                                  ) : null}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
