"use client";

import { useState } from "react";
import { launches, functions, type Launch, type Func, type RAG } from "@/src/data/launches";
import { cn } from "@/lib/cn";

const ragStyle: Record<RAG, string> = {
  green: "bg-rag-green-soft text-rag-green ring-1 ring-rag-green/40",
  amber: "bg-rag-amber-soft text-rag-amber ring-1 ring-rag-amber/40",
  red: "bg-rag-red-soft text-rag-red ring-1 ring-rag-red/40",
  na: "bg-surface-2 text-ink-subtle ring-1 ring-border",
};

const ragDot: Record<RAG, string> = {
  green: "bg-rag-green",
  amber: "bg-rag-amber",
  red: "bg-rag-red",
  na: "bg-ink-subtle",
};

export function ReadinessGrid() {
  const [selected, setSelected] = useState<Launch | null>(null);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
      <div className="overflow-x-auto rounded-card border border-border bg-surface">
        <table className="w-full min-w-[780px] text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="sticky left-0 bg-surface px-4 py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">
                Launch
              </th>
              {functions.map((f) => (
                <th
                  key={f}
                  className="px-3 py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted"
                >
                  {f}
                </th>
              ))}
              <th className="px-3 py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">
                Stage
              </th>
            </tr>
          </thead>
          <tbody>
            {launches.map((l) => (
              <tr
                key={l.id}
                onClick={() => setSelected(l)}
                className={cn(
                  "cursor-pointer border-b border-border/60 transition hover:bg-surface-2",
                  selected?.id === l.id && "bg-surface-2"
                )}
              >
                <td className="sticky left-0 bg-inherit px-4 py-3 align-top">
                  <div className="font-medium text-ink">{l.name}</div>
                  <div className="mt-0.5 text-[12px] text-ink-muted">
                    {l.owner}
                  </div>
                </td>
                {functions.map((f) => {
                  const cell = l.readiness[f as Func];
                  return (
                    <td key={f} className="px-3 py-3 align-top">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-medium capitalize",
                          ragStyle[cell.status]
                        )}
                      >
                        <span
                          className={cn("size-1.5 rounded-full", ragDot[cell.status])}
                        />
                        {cell.status === "na" ? "n/a" : cell.status}
                      </span>
                    </td>
                  );
                })}
                <td className="px-3 py-3 align-top">
                  <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-ink-muted">
                    {l.stage}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Side panel */}
      <aside className="rounded-card border border-border bg-surface p-5">
        {!selected ? (
          <div className="flex h-full min-h-[240px] flex-col items-start justify-center text-ink-muted">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-gold">
              Select a launch
            </div>
            <div className="mt-2 text-[14px]">
              Click a row to see the blocker, next milestone, and decision needed this week.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-gold">
                {selected.stage}
              </div>
              <h3 className="mt-1 text-[20px] font-semibold tracking-tight">
                {selected.name}
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
                {selected.scope}
              </p>
            </div>
            <div className="rounded-lg bg-bg-alt p-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                Next milestone
              </div>
              <div className="mt-1 text-[13px] text-ink">
                {selected.nextMilestone}{" "}
                <span className="text-ink-muted">· due {selected.nextMilestoneDue}</span>
              </div>
            </div>
            {selected.blocker && (
              <div className="rounded-lg border border-rag-red/30 bg-rag-red-soft/40 p-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-rag-red">
                  Blocker
                </div>
                <div className="mt-1 text-[13px] text-ink">{selected.blocker}</div>
              </div>
            )}
            {selected.decisionNeeded && (
              <div className="rounded-lg border border-gold/30 bg-gold-soft/30 p-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">
                  Decision needed
                </div>
                <div className="mt-1 text-[13px] text-ink">
                  {selected.decisionNeeded}
                </div>
              </div>
            )}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                Function notes
              </div>
              <ul className="mt-2 space-y-1.5 text-[12.5px]">
                {functions
                  .filter((f) => selected.readiness[f].note)
                  .map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="w-14 shrink-0 text-ink-subtle">{f}</span>
                      <span className="text-ink">{selected.readiness[f].note}</span>
                    </li>
                  ))}
                {functions.filter((f) => selected.readiness[f].note).length === 0 && (
                  <li className="text-ink-subtle">No function-level notes.</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
