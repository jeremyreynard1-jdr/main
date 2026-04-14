import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { IllustrativeChip } from "@/components/IllustrativeChip";
import { Timeline } from "@/components/timeline/Timeline";

export default function PlanPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <ModuleHeader
        eyebrow="30 · 60 · 90"
        title="First ninety days"
        subtitle="What the first 90 days look like. Each milestone deep-links to the artifact it produces in this site."
        right={<IllustrativeChip note="Dates assume Day 0 = start" />}
      />

      <Timeline />

      {/* Name reveal card */}
      <section className="mt-12 mb-16 rounded-card border border-gold/40 bg-gradient-to-br from-bg-alt to-surface p-8 md:p-10">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold">
          About the author
        </div>
        <h2 className="mt-3 font-display text-[28px] leading-tight text-ink md:text-[32px]">
          Jeremy Reynard
        </h2>
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-ink-muted">
          Operator. I build tools like this one for the teams I work with —
          the artifact itself is the argument. Every module on this site maps
          to a piece of work the Market Expansion function actually ships:
          lightweight playbooks, operating rhythms, decision-ready updates,
          cross-functional orchestration.
        </p>
        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink-muted">
          Happy to walk through any module live, and happy to rebuild any of
          it against your real launches.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="https://www.linkedin.com/in/jeremyreynard/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold-soft px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-gold hover:border-gold/70"
          >
            LinkedIn <ArrowUpRight size={12} />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted hover:text-ink"
          >
            ← Back to Control Center
          </Link>
        </div>
      </section>
    </div>
  );
}
