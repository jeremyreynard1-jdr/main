"use client";

import { useMemo, useState } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { IllustrativeChip } from "@/components/IllustrativeChip";
import { CompetitorCard } from "@/components/competitors/CompetitorCard";
import { FilterBar } from "@/components/competitors/FilterBar";
import { CompareTray } from "@/components/competitors/CompareTray";
import { competitors, type CompetitorTag } from "@/src/data/competitors";

export default function IntelPage() {
  const [activeTags, setActiveTags] = useState<CompetitorTag[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const toggleTag = (t: CompetitorTag) =>
    setActiveTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const toggleCompare = (id: string) =>
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });

  const visibleCompetitors = useMemo(() => {
    if (activeTags.length === 0) return competitors;
    return competitors.filter((c) =>
      c.facts.some((f) => activeTags.includes(f.tag))
    );
  }, [activeTags]);

  const selectedCompetitors = useMemo(
    () =>
      compareIds
        .map((id) => competitors.find((c) => c.id === id))
        .filter((c): c is (typeof competitors)[number] => Boolean(c)),
    [compareIds]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <ModuleHeader
        eyebrow="Competitive · Intel"
        title="Competitive intel"
        subtitle="Signals surfaced for weekly ops review — not a Gartner quadrant. Every claim sourced or chipped as illustrative. Pick two vendors to compare side-by-side."
        right={<IllustrativeChip note="Some pricing and expansion notes are estimates — all chipped" />}
      />

      <FilterBar
        active={activeTags}
        onToggle={toggleTag}
        onClear={() => setActiveTags([])}
      />

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleCompetitors.map((c) => (
          <CompetitorCard
            key={c.id}
            c={c}
            activeTags={activeTags}
            onToggleCompare={toggleCompare}
            comparing={compareIds.includes(c.id)}
          />
        ))}
      </div>

      <CompareTray
        selected={selectedCompetitors}
        onRemove={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
        onClear={() => setCompareIds([])}
      />
    </div>
  );
}
