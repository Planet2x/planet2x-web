export function SiteHeader() {
  return (
    <header className="flex items-center justify-between border-b border-[var(--border)] pb-5">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">
          Planet2x
        </p>
      </div>
      <p className="text-sm text-[var(--soft-foreground)]">Foundation v0.1</p>
    </header>
  );
}

