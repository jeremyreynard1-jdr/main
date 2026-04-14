import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function SourceLink({
  href,
  label,
  className,
}: {
  href: string;
  label?: string;
  className?: string;
}) {
  let host = "source";
  try {
    host = new URL(href).hostname.replace(/^www\./, "");
  } catch {}
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "inline-flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-wider text-ink-muted transition hover:text-gold",
        className
      )}
    >
      <span>{label ?? host}</span>
      <ArrowUpRight size={11} strokeWidth={2.25} />
    </a>
  );
}
