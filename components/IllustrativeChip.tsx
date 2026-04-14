import { cn } from "@/lib/cn";

export function IllustrativeChip({
  title = "Illustrative",
  note,
  className,
}: {
  title?: string;
  note?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold-soft/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold",
        className
      )}
      title={note}
    >
      <span className="size-1.5 rounded-full bg-gold" />
      {title}
      {note && (
        <span className="ml-1 font-sans text-[10px] normal-case tracking-normal text-ink-muted">
          — {note}
        </span>
      )}
    </span>
  );
}
