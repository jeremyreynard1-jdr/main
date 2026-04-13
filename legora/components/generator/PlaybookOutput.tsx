"use client";

import { Download, FileText } from "lucide-react";
import { type PlaybookTemplate } from "@/src/data/playbooks";
import { IllustrativeChip } from "@/components/IllustrativeChip";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h3 className="font-display text-[18px] text-ink">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function PlaybookOutput({ p }: { p: PlaybookTemplate }) {
  return (
    <article className="rounded-card border border-border bg-surface p-6 md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold">
            {p.launchType.replace("-", " ")} · {p.target}
          </div>
          <h2 className="mt-2 font-display text-[26px] leading-tight text-ink">
            {p.title}
          </h2>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-ink-muted">
            {p.oneLine}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled
            className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-border bg-bg-alt px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted opacity-60"
          >
            <FileText size={12} /> Export to Notion
          </button>
          <button
            disabled
            className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-border bg-bg-alt px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted opacity-60"
          >
            <Download size={12} /> PDF
          </button>
        </div>
      </header>

      <div className="mt-4">
        <IllustrativeChip note="Pre-launch template — wires into Linear/Notion/Salesforce on day 1" />
      </div>

      <Section title="Pre-launch checklist">
        <ul className="space-y-2">
          {p.checklist.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-ink">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-gold" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Cross-functional RACI">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-[12.5px]">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 text-left font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">
                  Activity
                </th>
                {["R", "A", "C", "I"].map((h) => (
                  <th
                    key={h}
                    className="w-28 py-2 pr-3 text-left font-mono text-[10.5px] uppercase tracking-[0.14em] text-gold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {p.raci.map((row, i) => (
                <tr key={i} className="border-b border-border/60">
                  <td className="py-2 pr-4 text-ink">{row.activity}</td>
                  <td className="py-2 pr-3 text-ink-muted">{row.R}</td>
                  <td className="py-2 pr-3 text-ink-muted">{row.A}</td>
                  <td className="py-2 pr-3 text-ink-muted">{row.C}</td>
                  <td className="py-2 pr-3 text-ink-muted">{row.I}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Operating cadence">
        <div className="flex flex-wrap gap-2">
          {p.cadence.map((c, i) => (
            <span
              key={i}
              className="rounded-full border border-border bg-bg-alt px-3 py-1 text-[12px] text-ink"
            >
              {c}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Success metrics">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-bg-alt p-4">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-gold">
              Input metrics
            </div>
            <ul className="mt-2 space-y-1.5">
              {p.metrics.input.map((m, i) => (
                <li key={i} className="text-[13px] text-ink">
                  · {m}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-bg-alt p-4">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-gold">
              Output metrics
            </div>
            <ul className="mt-2 space-y-1.5">
              {p.metrics.output.map((m, i) => (
                <li key={i} className="text-[13px] text-ink">
                  · {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Risks & mitigations">
        <div className="space-y-3">
          {p.risks.map((r, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-bg-alt p-4"
            >
              <div className="text-[13px] font-medium text-rag-red">
                {r.risk}
              </div>
              <div className="mt-1 text-[12.5px] text-ink-muted">
                <span className="font-mono uppercase tracking-[0.14em] text-gold">
                  Mitigate ·
                </span>{" "}
                {r.mitigation}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Comms plan">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-bg-alt p-4">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-gold">
              Internal
            </div>
            <ul className="mt-2 space-y-1.5">
              {p.comms.internal.map((m, i) => (
                <li key={i} className="text-[13px] text-ink">
                  · {m}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-bg-alt p-4">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-gold">
              External
            </div>
            <ul className="mt-2 space-y-1.5">
              {p.comms.external.map((m, i) => (
                <li key={i} className="text-[13px] text-ink">
                  · {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="30 · 60 · 90">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {(
            [
              { label: "Day 30", items: p.milestones.d30 },
              { label: "Day 60", items: p.milestones.d60 },
              { label: "Day 90", items: p.milestones.d90 },
            ] as const
          ).map((col) => (
            <div
              key={col.label}
              className="rounded-lg border border-border bg-bg-alt p-4"
            >
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-gold">
                {col.label}
              </div>
              <ul className="mt-2 space-y-1.5">
                {col.items.map((m, i) => (
                  <li key={i} className="text-[13px] text-ink">
                    · {m}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </article>
  );
}
