"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { SiteLogo } from "@/components/site-logo";
import { SocialLinks } from "@/components/social-links";

type SiteHeaderProps = {
  overlay?: boolean;
};

export function SiteHeader({ overlay = false }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();
  const headerClassName = overlay
    ? "flex flex-wrap items-center justify-between gap-4 py-6 text-shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
    : "flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5";

  const navClassName = overlay
    ? "hidden items-center gap-5 text-sm text-[rgba(245,247,251,0.82)] sm:flex"
    : "hidden items-center gap-5 text-sm text-[var(--soft-foreground)] sm:flex";

  const metaClassName = overlay
    ? "hidden text-xs uppercase tracking-[0.24em] text-[rgba(245,247,251,0.6)] sm:block"
    : "hidden text-xs uppercase tracking-[0.24em] text-[var(--muted)] sm:block";

  const menuButtonClassName = overlay
    ? "inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(255,255,255,0.16)] bg-[rgba(5,7,10,0.26)] text-[var(--foreground)] shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition hover:bg-[rgba(255,255,255,0.1)] sm:hidden"
    : "inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.03)] text-[var(--foreground)] transition hover:bg-[var(--panel)] sm:hidden";

  const menuPanelClassName = overlay
    ? "mt-4 rounded-[1.5rem] border border-[rgba(255,255,255,0.12)] bg-[rgba(6,8,12,0.82)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-md"
    : "mt-4 rounded-[1.5rem] border border-[var(--border)] bg-[rgba(10,13,20,0.9)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-md";

  return (
    <header className={headerClassName}>
      <div className="flex min-w-0 items-center gap-6">
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

      <div className="flex items-center gap-3">
        <p className={metaClassName}>
          Public site 0.x
        </p>
        <SocialLinks className="hidden sm:flex" compact />
        <button
          aria-controls={menuId}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className={menuButtonClassName}
          onClick={() => setIsMenuOpen((open) => !open)}
          type="button"
        >
          <span className="sr-only">
            {isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          </span>
          <span className="relative block h-4 w-4">
            <span
              className={`absolute left-0 top-[3px] h-[1.5px] w-4 rounded-full bg-current transition ${
                isMenuOpen ? "translate-y-[4px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-[1.5px] w-4 rounded-full bg-current transition ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[11px] h-[1.5px] w-4 rounded-full bg-current transition ${
                isMenuOpen ? "-translate-y-[4px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {isMenuOpen ? (
        <div className="basis-full sm:hidden">
          <div className={menuPanelClassName} id={menuId}>
            <nav className="flex flex-col gap-1">
              <Link
                className="rounded-xl px-3 py-3 text-sm text-[var(--foreground)] transition hover:bg-[rgba(255,255,255,0.06)]"
                href="/"
                onClick={() => setIsMenuOpen(false)}
              >
                Work
              </Link>
              <Link
                className="rounded-xl px-3 py-3 text-sm text-[var(--foreground)] transition hover:bg-[rgba(255,255,255,0.06)]"
                href="/privacy"
                onClick={() => setIsMenuOpen(false)}
              >
                Privacy
              </Link>
            </nav>

            <div className="mt-4 border-t border-[rgba(255,255,255,0.08)] pt-4">
              <SocialLinks compact />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
