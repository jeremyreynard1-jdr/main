import { AlertTriangle, CheckCircle2, Scale } from "lucide-react";
import { launches } from "@/src/data/launches";

export function ThisWeekCard() {
  const decisions = launches
    .filter((l) => l.decisionNeeded)
    .slice(0, 3);
  const blockers = launches.filter((l) => l.blocker).slice(0, 3);

  return (
    <section className="mt-10 rounded-card border border-border bg-surface p-5">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-[22px] font-semibold tracking-tight">
            This week
          </h2>
          <p className="mt-1 text-[13px] text-ink-muted">
            What leadership needs from us, what&rsquo;s stuck, and what&rsquo;s
            shipping. Mirrors the Thursday exec update.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gold/30 bg-gold-soft/30 p-4">
          <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-gold">
            <Scale size={12} strokeWidth={2.25} />
            Decisions needed
          </div>
          <ul className="mt-3 space-y-2 text-[13px]">
            {decisions.map((l) => (
              <li key={l.id}>
                <div className="text-ink">{l.decisionNeeded}</div>
                <div className="mt-0.5 text-[11px] text-ink-muted">
                  {l.name}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-rag-red/30 bg-rag-red-soft/30 p-4">
          <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-rag-red">
            <AlertTriangle size={12} strokeWidth={2.25} />
            Blockers
          </div>
          <ul className="mt-3 space-y-2 text-[13px]">
            {blockers.map((l) => (
              <li key={l.id}>
                <div className="text-ink">{l.blocker}</div>
                <div className="mt-0.5 text-[11px] text-ink-muted">
                  {l.name}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-rag-green/30 bg-rag-green-soft/30 p-4">
          <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-rag-green">
            <CheckCircle2 size={12} strokeWidth={2.25} />
            Shipping this week
          </div>
          <ul className="mt-3 space-y-2 text-[13px]">
            <li>
              <div className="text-ink">NYC scale-up Q2 ACV forecast</div>
              <div className="mt-0.5 text-[11px] text-ink-muted">
                Readout to exec Fri
              </div>
            </li>
            <li>
              <div className="text-ink">Portal GA launch comms</div>
              <div className="mt-0.5 text-[11px] text-ink-muted">
                War-room open through May 6
              </div>
            </li>
            <li>
              <div className="text-ink">DACH anchor firm MOU draft</div>
              <div className="mt-0.5 text-[11px] text-ink-muted">
                Legal sign-off target Thu
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
