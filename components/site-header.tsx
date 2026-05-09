import Link from "next/link";

import { SocialLinks } from "@/components/social-links";

export function SiteHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
      <div className="flex items-center gap-6">
        <Link className="text-sm font-medium uppercase tracking-[0.28em] text-[var(--foreground)]" href="/">
          Planet2x
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-[var(--soft-foreground)] sm:flex">
          <Link className="transition hover:text-[var(--foreground)]" href="/">
            Work
          </Link>
          <Link className="transition hover:text-[var(--foreground)]" href="/privacy">
            Privacy
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <p className="hidden text-xs uppercase tracking-[0.24em] text-[var(--muted)] sm:block">
          Public site 0.x
        </p>
        <SocialLinks compact />
      </div>
    </header>
  );
}
