import { ModuleHeader } from "@/components/ModuleHeader";
import { StatTile } from "@/components/StatTile";
import { IllustrativeChip } from "@/components/IllustrativeChip";
import { SourceLink } from "@/components/SourceLink";
import { LaunchBoard } from "@/components/control-center/LaunchBoard";
import { RhythmCalendar } from "@/components/control-center/RhythmCalendar";
import { ThisWeekCard } from "@/components/control-center/ThisWeekCard";
import { ModuleGrid } from "@/components/ModuleGrid";
import { launches } from "@/src/data/launches";

export default function HomePage() {
  const inFlight = launches.length;
  const openRisks = launches.filter((l) => l.blocker).length;
  const decisionsThisWeek = launches.filter((l) => l.decisionNeeded).length;
  const regionsLive = 6; // Stockholm, London, NYC, Denver, Sydney, Bengaluru — public

  return (
    <div className="hero-grid">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <ModuleHeader
          eyebrow="Market Expansion · Operations"
          title="The Expansion Index"
          subtitle="An operating system for how Legora enters new markets, scales existing ones, and keeps leadership informed. Built as the artifact — not a deck — of what I&rsquo;d run in the Head of Market Expansion role."
          right={<IllustrativeChip note="Cross-functional launch data is mock; public facts are sourced" />}
        />

        {/* Hero stat strip */}
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatTile
            label="Launches in flight"
            value={inFlight}
            hint="Across US, EU, UK, APAC, MENA"
          />
          <StatTile
            label="Open risks"
            value={openRisks}
            tone="red"
            hint="Blockers requiring cross-fn unblock"
          />
          <StatTile
            label="Decisions this week"
            value={decisionsThisWeek}
            tone="gold"
            hint="Up to leadership"
          />
          <StatTile
            label="Regions live"
            value={regionsLive}
            tone="green"
            hint="Stockholm · London · NYC · Denver · Sydney · Bengaluru"
          />
        </div>

        {/* Context strip */}
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-card border border-border bg-bg-alt px-5 py-3 text-[12.5px] text-ink-muted">
          <span>
            <span className="font-mono text-ink">$5.55B</span> valuation · Series D
          </span>
          <span>
            <span className="font-mono text-ink">800+</span> customers
          </span>
          <span>
            <span className="font-mono text-ink">50+</span> markets
          </span>
          <span>
            <span className="font-mono text-ink">~400</span> employees
          </span>
          <SourceLink
            href="https://techcrunch.com/2026/03/10/legora-reaches-5-55-billion-valuation-as-ai-legaltech-boom-endures"
            label="TechCrunch"
            className="ml-auto"
          />
        </div>

        <LaunchBoard />
        <RhythmCalendar />
        <ThisWeekCard />
        <ModuleGrid />
      </div>
    </div>
  );
}
