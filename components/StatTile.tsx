import { cn } from "@/lib/cn";

export function StatTile({
  label,
  value,
  hint,
  tone = "default",
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "gold" | "red" | "green" | "amber";
  className?: string;
}) {
  const valueTone = {
    default: "text-ink",
    gold: "text-gold",
    red: "text-rag-red",
    green: "text-rag-green",
    amber: "text-rag-amber",
  }[tone];
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-card border border-border bg-surface px-5 py-4 shadow-card",
        className
      )}
    >
      <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </div>
      <div className={cn("font-display text-[38px] leading-none", valueTone)}>
        {value}
      </div>
      {hint && (
        <div className="mt-1 text-[12px] text-ink-muted leading-snug">{hint}</div>
      )}
    </div>
  );
}
