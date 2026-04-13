"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { milestones } from "@/src/data/timeline";
import { cn } from "@/lib/cn";

type Bucket = "30" | "60" | "90";

const buckets: { v: Bucket; label: string; range: [number, number] }[] = [
  { v: "30", label: "First 30 days", range: [0, 30] },
  { v: "60", label: "Days 31–60", range: [31, 60] },
  { v: "90", label: "Days 61–90", range: [61, 90] },
];

export function Timeline() {
  const [active, setActive] = useState<Bucket | "all">("all");

  const visible = milestones.filter((m) => {
    if (active === "all") return true;
    const b = buckets.find((b) => b.v === active)!;
    return m.day >= b.range[0] && m.day <= b.range[1];
  });

  return (
    <section className="mt-8">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActive("all")}
          className={cn(
            "rounded-full border px-3 py-1 text-[11.5px] font-medium transition",
            active === "all"
              ? "border-gold/50 bg-gold-soft text-gold"
              : "border-border bg-surface text-ink-muted hover:text-ink"
          )}
        >
          Full 30-60-90
        </button>
        {buckets.map((b) => (
          <button
            key={b.v}
            onClick={() => setActive(b.v)}
            className={cn(
              "rounded-full border px-3 py-1 text-[11.5px] font-medium transition",
              active === b.v
                ? "border-gold/50 bg-gold-soft text-gold"
                : "border-border bg-surface text-ink-muted hover:text-ink"
            )}
          >
            {b.label}
          </button>
        ))}
      </div>

      <ol className="mt-8 relative border-l-2 border-border pl-6 md:pl-8">
        {visible.map((m) => (
          <li key={m.id} className="relative pb-8">
            <span className="absolute -left-[33px] top-1.5 flex size-4 items-center justify-center rounded-full border-2 border-gold bg-bg-alt">
              <span className="size-1.5 rounded-full bg-gold" />
            </span>

            <div className="rounded-card border border-border bg-surface p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold">
                  Day {m.day}
                </span>
                <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-muted">
                  {m.day <= 30 ? "30d" : m.day <= 60 ? "60d" : "90d"}
                </span>
              </div>
              <h3 className="mt-2 font-display text-[20px] text-ink">
                {m.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                {m.detail}
              </p>

              <dl className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-border bg-bg-alt p-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                    Deliverable
                  </dt>
                  <dd className="mt-1 text-[12.5px] text-ink">
                    {m.deliverable}
                  </dd>
                </div>
                <div className="rounded-lg border border-border bg-bg-alt p-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                    Success metric
                  </dt>
                  <dd className="mt-1 text-[12.5px] text-ink">
                    {m.successMetric}
                  </dd>
                </div>
              </dl>

              <Link
                href={m.linkTo.href}
                className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-gold hover:text-gold-deep"
              >
                Open → {m.linkTo.label}
                <ArrowRight size={11} />
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
