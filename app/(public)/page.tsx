import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SocialLinks } from "@/components/social-links";
import { WorkVisualSection } from "@/components/work-visual-section";
import { getFrontmatterText, getPageBySlug, getWorkEntries } from "@/lib/content";

export default async function HomePage() {
  const [homePage, aboutPage, works] = await Promise.all([
    getPageBySlug("home"),
    getPageBySlug("about"),
    getWorkEntries(),
  ]);

  const studioStillImage = getFrontmatterText(homePage.frontmatter, "studioStillImage");

  return (
    <main
      id="top"
      className="min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(119,241,255,0.16),transparent_32%),radial-gradient(circle_at_75%_12%,rgba(125,93,255,0.12),transparent_26%)]" />

      <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-10">
        <SiteHeader />
      </div>

      <div className="border-t border-[var(--divider)]">
        {works.map((work, index) => (
          <WorkVisualSection key={work.slug} priority={index === 0} work={work} />
        ))}
      </div>

      <section className="border-t border-[var(--divider)]">
        <div className="mx-auto grid min-h-[72svh] max-w-7xl gap-0 px-6 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
          <div
            aria-hidden="true"
            className="min-h-[24rem] rounded-b-[2rem] border-x border-b border-[var(--border)] lg:min-h-full lg:rounded-b-none lg:rounded-r-[2rem] lg:border-l-0"
            style={{
              backgroundImage: studioStillImage
                ? `linear-gradient(180deg, rgba(4,6,8,0.12), rgba(4,6,8,0.72)), url("${studioStillImage}")`
                : "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)), radial-gradient(circle at 26% 18%, rgba(119,241,255,0.16), transparent 24%), radial-gradient(circle at 72% 44%, rgba(125,93,255,0.18), transparent 22%), linear-gradient(140deg, rgba(9,10,15,1), rgba(14,16,24,1))",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />

          <div className="flex items-end py-16 lg:py-20">
            <div className="max-w-lg">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--accent-soft)]">
                Studio note
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-balance sm:text-5xl">
                Small studio. Atmospheric worlds. Intentional pace.
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-[var(--soft-foreground)]">
                {aboutPage.excerpt}
              </p>
              <Link
                className="mt-7 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-3 text-sm transition hover:border-[var(--border-strong)] hover:bg-[var(--panel)]"
                href="/privacy"
              >
                Read privacy
                <span aria-hidden="true">/</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <SiteFooter>
          <div className="flex flex-col gap-5 sm:items-end">
            <div className="flex flex-wrap items-center gap-5">
              <SocialLinks />
              <a
                className="text-sm text-[var(--soft-foreground)] transition hover:text-[var(--foreground)]"
                href="mailto:support@planet2x.com"
              >
                support@planet2x.com
              </a>
              <Link
                className="text-sm text-[var(--soft-foreground)] transition hover:text-[var(--foreground)]"
                href="/privacy"
              >
                Privacy
              </Link>
              <a
                className="text-sm text-[var(--soft-foreground)] transition hover:text-[var(--foreground)]"
                href="#top"
              >
                Top
              </a>
            </div>
            <p className="text-sm text-[var(--muted)]">
              {getFrontmatterText(homePage.frontmatter, "footerNote")}
            </p>
          </div>
        </SiteFooter>
      </div>
    </main>
  );
}
