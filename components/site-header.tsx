import Link from "next/link";

import { SiteLogo } from "@/components/site-logo";
import { SocialLinks } from "@/components/social-links";

type SiteHeaderProps = {
  overlay?: boolean;
};

export function SiteHeader({ overlay = false }: SiteHeaderProps) {
  const headerClassName = overlay
    ? "flex flex-wrap items-center justify-between gap-4 py-6 text-shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
    : "flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5";

  const navClassName = overlay
    ? "hidden items-center gap-5 text-sm text-[rgba(245,247,251,0.82)] sm:flex"
    : "hidden items-center gap-5 text-sm text-[var(--soft-foreground)] sm:flex";

  const metaClassName = overlay
    ? "hidden text-xs uppercase tracking-[0.24em] text-[rgba(245,247,251,0.6)] sm:block"
    : "hidden text-xs uppercase tracking-[0.24em] text-[var(--muted)] sm:block";

  return (
    <header className={headerClassName}>
      <div className="flex items-center gap-6">
        <Link className="shrink-0" href="/">
          <SiteLogo />
        </Link>
        <nav className={navClassName}>
          <Link className="transition hover:text-[var(--foreground)]" href="/">
            Work
          </Link>
          <Link className="transition hover:text-[var(--foreground)]" href="/privacy">
            Privacy
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <p className={metaClassName}>
          Public site 0.x
        </p>
        <SocialLinks compact />
      </div>
    </header>
  );
}
