"use client";

import { useState } from "react";
import { rhythms, type Cadence } from "@/src/data/rhythm";
import { cn } from "@/lib/cn";

const cadenceTone: Record<Cadence, string> = {
  Weekly: "border-rag-green/40 bg-rag-green-soft/30 text-rag-green",
  Biweekly: "border-gold/40 bg-gold-soft/40 text-gold",
  Monthly: "border-rag-amber/40 bg-rag-amber-soft/30 text-rag-amber",
  Quarterly: "border-ink-subtle/40 bg-surface-2 text-ink-muted",
};

export function RhythmCalendar() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <section className="mt-10 rounded-card border border-border bg-surface p-5">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-[22px] font-semibold tracking-tight">
            Operating rhythm
          </h2>
          <p className="mt-1 text-[13px] text-ink-muted">
            The cadence I&rsquo;d install on day 1 — how decisions get made,
            weekly, monthly, quarterly.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {rhythms.map((r) => (
          <button
            key={r.id}
            onClick={() => setActive(active === r.id ? null : r.id)}
            className={cn(
              "rounded-lg border border-border bg-bg-alt p-4 text-left transition hover:border-gold/40 hover:bg-surface-2",
              active === r.id && "border-gold/60 bg-surface-2"
            )}
          >
            <span
              className={cn(
                "inline-flex rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]",
                cadenceTone[r.cadence]
              )}
            >
              {r.cadence}
            </span>
            <div className="mt-2 text-[14px] font-medium text-ink">{r.name}</div>
            <div className="mt-1 font-mono text-[11px] text-ink-muted">
              {r.day} · {r.duration}
            </div>
            {active === r.id && (
              <div className="mt-3 space-y-2 text-[12px] leading-relaxed">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-subtle">
                    Purpose
                  </div>
                  <div className="text-ink">{r.purpose}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-subtle">
                    Attendees
                  </div>
                  <div className="text-ink">{r.attendees}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-subtle">
                    Artifact
                  </div>
                  <div className="text-ink">{r.artifact}</div>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
