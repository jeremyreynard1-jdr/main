"use client";

import {
  playbooks,
  launchTypes,
  type LaunchType,
  type PlaybookTemplate,
} from "@/src/data/playbooks";
import { cn } from "@/lib/cn";

export function PlaybookForm({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (p: PlaybookTemplate) => void;
}) {
  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold">
        Step 1 · Pick a launch
      </div>
      <p className="mt-1 text-[12.5px] text-ink-muted">
        Four pre-baked templates seeded from Legora&rsquo;s real expansion vectors. Each maps the full cross-functional plan.
      </p>

      <div className="mt-5 space-y-5">
        {launchTypes.map((lt) => {
          const group = playbooks.filter((p) => p.launchType === lt.value);
          if (group.length === 0) return null;
          return (
            <div key={lt.value}>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                {lt.label}
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2">
                {group.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelect(p)}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-left transition",
                      selectedId === p.id
                        ? "border-gold/50 bg-gold-soft/60"
                        : "border-border bg-bg-alt hover:border-gold/30"
                    )}
                  >
                    <div className="text-[13px] font-medium text-ink">
                      {p.title}
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-ink-muted">
                      {p.target}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
