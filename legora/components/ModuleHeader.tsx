import { cn } from "@/lib/cn";

export function ModuleHeader({
  eyebrow,
  title,
  subtitle,
  right,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-border pb-6 pt-10 md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className="max-w-3xl">
        {eyebrow && (
          <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-[34px] leading-[1.08] md:text-[42px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink-muted">
            {subtitle}
          </p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
