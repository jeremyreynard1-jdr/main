import Link from "next/link";
import {
  MapPinned,
  Radar,
  Radio,
  Workflow,
  CalendarCheck,
  Activity,
} from "lucide-react";

const modules = [
  {
    href: "/",
    title: "Launch Control",
    desc: "Cross-functional readiness tracker across active expansion launches. Grid and stage views.",
    Icon: Activity,
  },
  {
    href: "/map",
    title: "Coverage Map",
    desc: "Geographic footprint — Legora customers, targets, and Harvey overlap.",
    Icon: MapPinned,
  },
  {
    href: "/intel",
    title: "Competitive Intel",
    desc: "Filterable cards on Harvey, Hebbia, Robin, Spellbook, and 5 more. Every claim sourced.",
    Icon: Radar,
  },
  {
    href: "/signals",
    title: "Signals Feed",
    desc: "Continuous intel stream — hires, RFPs, funding, product. Feeds the weekly exec update.",
    Icon: Radio,
  },
  {
    href: "/playbooks",
    title: "Workflow Generator",
    desc: "Playbook + Weekly Update generators. The on-the-nose JD artifact.",
    Icon: Workflow,
  },
  {
    href: "/plan",
    title: "30-60-90 Plan",
    desc: "What I&apos;d ship in the first 90 days. Deep-links back to each module.",
    Icon: CalendarCheck,
  },
];

export function ModuleGrid() {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="font-display text-[22px] font-semibold tracking-tight">
            Modules
          </h2>
          <p className="mt-1 text-[13px] text-ink-muted">
            Six surfaces that together form the expansion operating system.
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map(({ href, title, desc, Icon }) => (
          <Link
            key={href + title}
            href={href}
            className="group rounded-card border border-border bg-surface p-5 transition hover:border-gold/40 hover:bg-surface-2"
          >
            <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-gold">
              <Icon size={14} strokeWidth={2} />
              {title}
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-muted group-hover:text-ink">
              {desc}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
