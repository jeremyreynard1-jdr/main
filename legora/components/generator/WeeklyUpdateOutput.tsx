"use client";

import { useMemo, useRef, useState } from "react";
import { Clipboard, Check } from "lucide-react";
import { launches, type Launch } from "@/src/data/launches";
import { signals } from "@/src/data/signals";
import { IllustrativeChip } from "@/components/IllustrativeChip";

function buildMarkdown(weekOf: string, selected: Launch[]) {
  const decisions = selected.filter((l) => l.decisionNeeded);
  const blockers = selected.filter((l) => l.blocker);
  const greens = selected.filter((l) =>
    Object.values(l.readiness).every(
      (r) => r.status === "green" || r.status === "na"
    )
  );
  const recentActs = signals
    .filter((s) => s.impact !== "Monitor")
    .slice(0, 4);

  const lines: string[] = [];
  lines.push(`# Expansion weekly — week of ${weekOf || "[week]"}`);
  lines.push("");
  lines.push("## Highlights");
  if (greens.length) {
    greens.forEach((l) =>
      lines.push(`- ${l.name}: ${l.nextMilestone} tracking to ${l.nextMilestoneDue}.`)
    );
  } else {
    lines.push("- No fully-green launches this week — see blockers.");
  }
  lines.push("");
  lines.push("## Decisions needed");
  if (decisions.length === 0) lines.push("- None this week.");
  decisions.forEach((l) => lines.push(`- **${l.name}** — ${l.decisionNeeded}`));
  lines.push("");
  lines.push("## Blockers");
  if (blockers.length === 0) lines.push("- None open with exec surface area.");
  blockers.forEach((l) => lines.push(`- **${l.name}** — ${l.blocker}`));
  lines.push("");
  lines.push("## Risks on the horizon");
  recentActs.forEach((s) => lines.push(`- ${s.category}: ${s.headline} — ${s.soWhat}`));
  lines.push("");
  lines.push("## Wins");
  lines.push("- Husch Blackwell firmwide rollout announced (customer-facing).");
  lines.push("- White & Case global deployment holding at >70% activation.");
  lines.push("");
  lines.push("## Next week");
  selected.slice(0, 5).forEach((l) =>
    lines.push(`- ${l.name}: ${l.nextMilestone} (${l.nextMilestoneDue})`)
  );
  return lines.join("\n");
}

export function WeeklyUpdateOutput({
  weekOf,
  selectedIds,
}: {
  weekOf: string;
  selectedIds: string[];
}) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLPreElement>(null);

  const selected = useMemo(
    () => launches.filter((l) => selectedIds.includes(l.id)),
    [selectedIds]
  );

  const markdown = useMemo(
    () => buildMarkdown(weekOf, selected),
    [weekOf, selected]
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  if (selected.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-border bg-surface p-8 text-center text-[13px] text-ink-muted">
        Pick one or more launches to generate the update.
      </div>
    );
  }

  return (
    <article className="rounded-card border border-border bg-surface p-6 md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold">
            Thursday exec update · Preview
          </div>
          <h2 className="mt-2 font-display text-[24px] leading-tight text-ink">
            Expansion weekly — {weekOf || "week of …"}
          </h2>
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-alt px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink hover:border-gold/40 hover:text-gold"
        >
          {copied ? <Check size={12} /> : <Clipboard size={12} />}
          {copied ? "Copied" : "Copy markdown"}
        </button>
      </header>

      <div className="mt-4">
        <IllustrativeChip note="Draft from live launch data — a real update would cite Salesforce / Linear IDs" />
      </div>

      <pre
        ref={ref}
        className="mt-5 whitespace-pre-wrap break-words rounded-lg border border-border bg-bg-alt p-5 font-mono text-[12.5px] leading-relaxed text-ink"
      >
        {markdown}
      </pre>
    </article>
  );
}
