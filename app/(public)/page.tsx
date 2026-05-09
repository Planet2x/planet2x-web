import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SocialLinks } from "@/components/social-links";
import {
  getFrontmatterList,
  getFrontmatterText,
  getPageBySlug,
  getWorkEntries,
} from "@/lib/content";

const featuredWorkSlug = "lumen-path";

export default async function HomePage() {
  const [homePage, aboutPage, works] = await Promise.all([
    getPageBySlug("home"),
    getPageBySlug("about"),
    getWorkEntries(),
  ]);

  const featuredWork = works.find((work) => work.slug === featuredWorkSlug) ?? works[0];
  const workCards = featuredWork
    ? [featuredWork, ...works.filter((work) => work.slug !== featuredWork.slug)]
    : works;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[42rem] bg-[radial-gradient(circle_at_top,rgba(119,241,255,0.17),transparent_30%),radial-gradient(circle_at_75%_18%,rgba(125,93,255,0.16),transparent_22%)]" />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <SiteHeader />

        <section className="grid flex-1 gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-[var(--accent-soft)]">
              {getFrontmatterText(homePage.frontmatter, "eyebrow")}
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
              {getFrontmatterText(homePage.frontmatter, "heroTitle")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--soft-foreground)] sm:text-xl">
              {getFrontmatterText(homePage.frontmatter, "heroSubtitle")}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-[var(--soft-foreground)]">
              <a
                className="rounded-full border border-[var(--border-strong)] bg-[var(--foreground)] px-5 py-3 font-medium text-[var(--background)] transition hover:opacity-90"
                href="#work"
              >
                View recent work
              </a>
              <a
                className="rounded-full border border-[var(--border)] px-5 py-3 transition hover:border-[var(--border-strong)] hover:bg-[var(--panel)]"
                href="#newsletter"
              >
                Occasional updates
              </a>
            </div>
          </div>

          {featuredWork ? (
            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(119,241,255,0.18),transparent_55%)] blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(155deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03)_30%,rgba(255,255,255,0.01)),radial-gradient(circle_at_25%_20%,rgba(119,241,255,0.18),transparent_24%),radial-gradient(circle_at_80%_18%,rgba(125,93,255,0.18),transparent_22%),var(--panel-strong)] p-6 shadow-[0_24px_120px_rgba(0,0,0,0.45)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-soft)]">
                      Featured work
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">
                      {featuredWork.title}
                    </h2>
                  </div>
                  <div className="rounded-full border border-[var(--border)] px-3 py-1 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    {getFrontmatterText(featuredWork.frontmatter, "status")}
                  </div>
                </div>

                <p className="mt-6 max-w-md text-sm leading-7 text-[var(--soft-foreground)] sm:text-base">
                  {featuredWork.excerpt}
                </p>

                <div className="mt-10 grid gap-3 sm:grid-cols-2">
                  {getFrontmatterList(featuredWork.frontmatter, "tags")
                    .slice(0, 4)
                    .map((tag) => (
                      <div
                        key={tag}
                        className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--soft-foreground)]"
                      >
                        {tag}
                      </div>
                    ))}
                </div>

                <div className="mt-10 rounded-[1.5rem] border border-[var(--border)] bg-[rgba(6,10,20,0.55)] p-5">
                  <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                    Placeholder visual field
                  </p>
                  <div className="mt-4 h-44 rounded-[1.25rem] bg-[linear-gradient(135deg,rgba(123,244,255,0.18),rgba(22,22,28,0.1)_42%,rgba(133,101,255,0.25)),radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_16%),radial-gradient(circle_at_70%_55%,rgba(123,244,255,0.2),transparent_18%),#06070a]" />
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <section
          id="featured"
          className="grid gap-6 border-t border-[var(--border)] py-14 lg:grid-cols-[0.7fr_1.3fr]"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-soft)]">
              Lumen Path
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              A luminous first signal for the new Planet2x direction.
            </h2>
          </div>
          <p className="max-w-3xl text-base leading-8 text-[var(--soft-foreground)] sm:text-lg">
            {featuredWork?.body}
          </p>
        </section>

        <section id="work" className="border-t border-[var(--border)] py-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-soft)]">
                Recent work
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Small worlds, strong atmosphere, careful craft.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--soft-foreground)] sm:text-base">
              The grid is intentionally simple for 0.x. It is ready to evolve as
              real media and deeper work pages arrive.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {workCards.map((work) => (
              <article
                key={work.slug}
                className="group overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02)),var(--panel)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
              >
                <div className="rounded-[1.5rem] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.02)),radial-gradient(circle_at_20%_20%,rgba(123,244,255,0.22),transparent_18%),radial-gradient(circle_at_72%_28%,rgba(135,102,255,0.2),transparent_18%),#090b11] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                    {getFrontmatterText(work.frontmatter, "year")}
                  </p>
                  <h3 className="mt-10 text-2xl font-semibold tracking-[-0.03em]">
                    {work.title}
                  </h3>
                </div>

                <p className="mt-5 text-sm leading-7 text-[var(--soft-foreground)] sm:text-base">
                  {work.excerpt}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {getFrontmatterList(work.frontmatter, "tags")
                    .slice(0, 3)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[var(--border)] px-3 py-1 text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 border-t border-[var(--border)] py-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-soft)]">
              Studio note
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Planet2x stays small on purpose.
            </h2>
          </div>
          <div className="max-w-3xl space-y-5 text-base leading-8 text-[var(--soft-foreground)] sm:text-lg">
            {aboutPage.body.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section
          id="newsletter"
          className="grid gap-6 border-t border-[var(--border)] py-14 lg:grid-cols-[0.75fr_1.25fr]"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-soft)]">
              Newsletter
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              {getFrontmatterText(homePage.frontmatter, "newsletterTitle")}
            </h2>
          </div>
          <div className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02)),var(--panel)] p-6">
            <p className="max-w-2xl text-base leading-8 text-[var(--soft-foreground)] sm:text-lg">
              {getFrontmatterText(homePage.frontmatter, "newsletterNote")}
            </p>
            <form className="mt-8 flex flex-col gap-3 sm:flex-row" action="#">
              <input
                aria-label="Email address"
                className="min-h-12 flex-1 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-5 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
                placeholder="name@email.com"
                type="email"
              />
              <button
                className="min-h-12 rounded-full border border-[var(--border-strong)] bg-[rgba(255,255,255,0.06)] px-5 text-sm font-medium transition hover:bg-[rgba(255,255,255,0.1)]"
                type="submit"
              >
                Placeholder only
              </button>
            </form>
          </div>
        </section>

        <SiteFooter>
          <div className="flex flex-wrap items-center gap-5">
            <SocialLinks />
            <a
              className="text-sm text-[var(--soft-foreground)] transition hover:text-[var(--foreground)]"
              href="mailto:support@planet2x.com"
            >
              support@planet2x.com
            </a>
          </div>
        </SiteFooter>
      </div>
    </main>
  );
}
