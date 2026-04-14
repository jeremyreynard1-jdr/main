export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-alt">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-ink-muted md:flex-row md:items-center md:justify-between md:px-6">
        <div className="font-mono uppercase tracking-wider">
          Expansion Center · v0.1 · Illustrative data where not cited
        </div>
        <div className="flex gap-4">
          <span>Product demo — sources inline, assumptions flagged</span>
        </div>
      </div>
    </footer>
  );
}
