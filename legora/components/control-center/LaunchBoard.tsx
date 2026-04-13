"use client";

import { useState } from "react";
import { LayoutGrid, Rows3 } from "lucide-react";
import { ReadinessGrid } from "./ReadinessGrid";
import { StageBoard } from "./StageBoard";
import { cn } from "@/lib/cn";

type View = "readiness" | "stage";

export function LaunchBoard() {
  const [view, setView] = useState<View>("readiness");
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="font-display text-[22px] font-semibold tracking-tight">
            Launch board
          </h2>
          <p className="mt-1 text-[13px] text-ink-muted">
            Cross-functional readiness across active expansion launches. Toggle
            views.
          </p>
        </div>
        <div className="flex gap-1 rounded-full border border-border bg-surface p-1">
          <button
            onClick={() => setView("readiness")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition",
              view === "readiness"
                ? "bg-bg-alt text-ink"
                : "text-ink-muted hover:text-ink"
            )}
          >
            <LayoutGrid size={12} strokeWidth={2.25} />
            Readiness grid
          </button>
          <button
            onClick={() => setView("stage")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition",
              view === "stage"
                ? "bg-bg-alt text-ink"
                : "text-ink-muted hover:text-ink"
            )}
          >
            <Rows3 size={12} strokeWidth={2.25} />
            Stage board
          </button>
        </div>
      </div>
      {view === "readiness" ? <ReadinessGrid /> : <StageBoard />}
    </section>
  );
}
