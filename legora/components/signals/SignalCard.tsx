import { type Signal } from "@/src/data/signals";
import { SourceLink } from "@/components/SourceLink";
import { IllustrativeChip } from "@/components/IllustrativeChip";
import { cn } from "@/lib/cn";

const impactStyles: Record<Signal["impact"], string> = {
  Monitor: "bg-surface-2 text-ink-muted ring-1 ring-border",
  Act: "bg-rag-amber-soft/40 text-rag-amber ring-1 ring-rag-amber/30",
  Escalate: "bg-rag-red-soft/40 text-rag-red ring-1 ring-rag-red/30",
};

const typeLabels: Record<Signal["type"], string> = {
  "competitor-hire": "Hire",
  "firm-rfp": "RFP",
  partnership: "Partnership",
  funding: "Funding",
  "product-launch": "Product",
  regulatory: "Regulatory",
  media: "Media",
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SignalCard({ s }: { s: Signal }) {
  return (
    <article className="rounded-card border border-border bg-surface p-5">
      <header className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink">
          {s.category}
        </span>
        <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-muted">
          {typeLabels[s.type]}
        </span>
        {s.region && (
          <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-muted">
            {s.region}
          </span>
        )}
        <span className="ml-auto font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">
          {fmtDate(s.date)}
        </span>
      </header>

      <h3 className="mt-3 text-[15px] font-medium leading-snug text-ink">
        {s.headline}
      </h3>

      <div className="mt-3 border-l-2 border-gold/40 pl-3">
        <div className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-gold">
          So what
        </div>
        <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">
          {s.soWhat}
        </p>
      </div>

      <footer className="mt-4 flex flex-wrap items-center gap-3">
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
            impactStyles[s.impact]
          )}
        >
          {s.impact}
        </span>
        {s.illustrative ? (
          <IllustrativeChip title="Illustrative" />
        ) : s.source ? (
          <SourceLink href={s.source} />
        ) : null}
      </footer>
    </article>
  );
}
