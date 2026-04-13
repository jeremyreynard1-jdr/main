"use client";

import { useMemo, useState } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { IllustrativeChip } from "@/components/IllustrativeChip";
import { SignalCard } from "@/components/signals/SignalCard";
import { SignalFilterBar } from "@/components/signals/SignalFilterBar";
import {
  signals,
  type SignalCategory,
  type SignalImpact,
} from "@/src/data/signals";

export default function SignalsPage() {
  const [category, setCategory] = useState<SignalCategory | "all">("all");
  const [impact, setImpact] = useState<SignalImpact | "all">("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    return signals
      .filter((s) => {
        if (category !== "all" && s.category !== category) return false;
        if (impact !== "all" && s.impact !== impact) return false;
        if (query.trim()) {
          const q = query.toLowerCase();
          if (
            !s.headline.toLowerCase().includes(q) &&
            !s.soWhat.toLowerCase().includes(q)
          )
            return false;
        }
        return true;
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [category, impact, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <ModuleHeader
        eyebrow="Intel · Signals feed"
        title="Signals"
        subtitle="The raw intel stream. Each item carries a one-line ops POV and an impact chip — this is the pipe that feeds the Thursday exec update and the Decisions Needed card on home."
        right={<IllustrativeChip note="Real items sourced; forward-looking items chipped illustrative" />}
      />

      <SignalFilterBar
        category={category}
        onCategory={setCategory}
        impact={impact}
        onImpact={setImpact}
        query={query}
        onQuery={setQuery}
        total={signals.length}
        showing={visible.length}
      />

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {visible.length === 0 ? (
          <div className="col-span-full rounded-card border border-dashed border-border bg-surface p-8 text-center text-[13px] text-ink-muted">
            No signals match these filters.
          </div>
        ) : (
          visible.map((s) => <SignalCard key={s.id} s={s} />)
        )}
      </div>
    </div>
  );
}
