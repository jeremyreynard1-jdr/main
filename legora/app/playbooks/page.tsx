"use client";

import { useState } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { IllustrativeChip } from "@/components/IllustrativeChip";
import { PlaybookForm } from "@/components/generator/PlaybookForm";
import { PlaybookOutput } from "@/components/generator/PlaybookOutput";
import { WeeklyUpdateForm } from "@/components/generator/WeeklyUpdateForm";
import { WeeklyUpdateOutput } from "@/components/generator/WeeklyUpdateOutput";
import { playbooks, type PlaybookTemplate } from "@/src/data/playbooks";
import { launches } from "@/src/data/launches";
import { cn } from "@/lib/cn";

type Mode = "playbook" | "weekly";

export default function PlaybooksPage() {
  const [mode, setMode] = useState<Mode>("playbook");

  const [selectedPlaybook, setSelectedPlaybook] = useState<PlaybookTemplate>(
    playbooks[0]
  );

  const [weekOf, setWeekOf] = useState("Apr 13, 2026");
  const [selectedIds, setSelectedIds] = useState<string[]>(
    launches.filter((l) => l.decisionNeeded || l.blocker).map((l) => l.id)
  );

  const toggleLaunch = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <ModuleHeader
        eyebrow="Workflow · Generator"
        title="Playbooks & weekly updates"
        subtitle="Two tools for the two JD-hero bullets: build lightweight playbooks that make expansion repeatable · create decision-ready updates. Both outputs live off the real launch data from home."
        right={<IllustrativeChip note="Pre-baked templates; wires into Notion / Linear on day 1" />}
      />

      <div className="mt-6 flex gap-1 rounded-full border border-border bg-surface p-1 w-fit">
        {(
          [
            { v: "playbook", label: "Playbook generator" },
            { v: "weekly", label: "Weekly update generator" },
          ] as { v: Mode; label: string }[]
        ).map((opt) => (
          <button
            key={opt.v}
            onClick={() => setMode(opt.v)}
            className={cn(
              "rounded-full px-4 py-1.5 text-[12px] font-medium transition",
              mode === opt.v
                ? "bg-bg-alt text-ink"
                : "text-ink-muted hover:text-ink"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {mode === "playbook" ? (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <PlaybookForm
            selectedId={selectedPlaybook.id}
            onSelect={setSelectedPlaybook}
          />
          <PlaybookOutput p={selectedPlaybook} />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          <WeeklyUpdateForm
            weekOf={weekOf}
            onWeekOf={setWeekOf}
            selectedIds={selectedIds}
            onToggle={toggleLaunch}
            onAll={() => setSelectedIds(launches.map((l) => l.id))}
            onClear={() => setSelectedIds([])}
          />
          <WeeklyUpdateOutput weekOf={weekOf} selectedIds={selectedIds} />
        </div>
      )}
    </div>
  );
}
