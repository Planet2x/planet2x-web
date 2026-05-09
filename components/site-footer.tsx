import type { ReactNode } from "react";

export function SiteFooter({ children }: { children?: ReactNode }) {
  return (
    <footer className="flex flex-col gap-5 border-t border-[var(--border)] py-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-[var(--soft-foreground)]">
          Planet2x Creative Studio
        </p>
      </div>
      {children}
    </footer>
  );
}
