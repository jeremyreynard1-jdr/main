"use client";

import { launches, type Launch } from "@/src/data/launches";
import { cn } from "@/lib/cn";

export function WeeklyUpdateForm({
  weekOf,
  onWeekOf,
  selectedIds,
  onToggle,
  onAll,
  onClear,
}: {
  weekOf: string;
  onWeekOf: (v: string) => void;
  selectedIds: string[];
  onToggle: (id: string) => void;
  onAll: () => void;
  onClear: () => void;
}) {
  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold">
        Step 1 · Configure the update
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">
            Week of
          </label>
          <input
            type="text"
            value={weekOf}
            onChange={(e) => onWeekOf(e.target.value)}
            placeholder="e.g. Apr 13, 2026"
            className="mt-1 w-full rounded-lg border border-border bg-bg-alt px-3 py-2 text-[13px] text-ink placeholder:text-ink-muted/70 focus:border-gold/50 focus:outline-none"
          />
        </div>

        <div className="flex items-end justify-end gap-2">
          <button
            onClick={onAll}
            className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted hover:text-gold"
          >
            Select all
          </button>
          <span className="text-ink-muted">·</span>
          <button
            onClick={onClear}
            className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted hover:text-gold"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-5">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">
          Include launches
        </div>
        <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
          {launches.map((l: Launch) => {
            const on = selectedIds.includes(l.id);
            return (
              <button
                key={l.id}
                onClick={() => onToggle(l.id)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left transition",
                  on
                    ? "border-gold/50 bg-gold-soft/60"
                    : "border-border bg-bg-alt hover:border-gold/30"
                )}
              >
                <div className="text-[13px] font-medium text-ink">{l.name}</div>
                <div className="mt-0.5 text-[11.5px] text-ink-muted">
                  {l.stage} · {l.owner}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
