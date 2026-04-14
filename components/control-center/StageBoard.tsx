"use client";

import { launches, stageOrder, type LaunchStage } from "@/src/data/launches";
import { cn } from "@/lib/cn";

const stageTint: Record<LaunchStage, string> = {
  Discover: "text-ink-subtle",
  Scope: "text-ink-muted",
  "Build Plan": "text-gold",
  Launch: "text-rag-green",
  Scale: "text-rag-green",
  Retro: "text-ink-subtle",
};

export function StageBoard() {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[1100px] gap-3">
        {stageOrder.map((stage) => {
          const items = launches.filter((l) => l.stage === stage);
          return (
            <div
              key={stage}
              className="w-56 shrink-0 rounded-card border border-border bg-surface"
            >
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <span
                  className={cn(
                    "font-mono text-[10.5px] uppercase tracking-[0.14em]",
                    stageTint[stage]
                  )}
                >
                  {stage}
                </span>
                <span className="font-mono text-[10.5px] text-ink-muted">
                  {items.length}
                </span>
              </div>
              <ul className="flex flex-col gap-2 p-3">
                {items.map((l) => (
                  <li
                    key={l.id}
                    className="rounded-lg border border-border bg-bg-alt p-3"
                  >
                    <div className="text-[13px] font-medium text-ink">
                      {l.name}
                    </div>
                    <div className="mt-1 text-[11.5px] text-ink-muted">
                      {l.owner}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-ink-subtle">
                      <span>{l.nextMilestone}</span>
                      <span className="font-mono">{l.nextMilestoneDue}</span>
                    </div>
                  </li>
                ))}
                {items.length === 0 && (
                  <li className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-[11.5px] text-ink-subtle">
                    —
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
