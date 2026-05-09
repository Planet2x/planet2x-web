import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getFrontmatterText,
  getWorkBySlug,
  getWorkSlugs,
} from "@/lib/content";

type WorkPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getWorkSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const work = await getWorkBySlug(slug);
    return {
      title: work.title,
      description: work.excerpt,
    };
  } catch {
    return {
      title: "Work",
    };
  }
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;

  const work = await getWorkBySlug(slug).catch(() => notFound());

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-6 py-6 sm:px-8 lg:px-10">
        <SiteHeader />
        <section className="border-t border-[var(--divider)] py-14">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--accent-soft)]">
            {getFrontmatterText(work.frontmatter, "status")} /{" "}
            {getFrontmatterText(work.frontmatter, "year")}
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-balance sm:text-6xl">
            {work.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--soft-foreground)]">
            {work.excerpt}
          </p>
          <div className="mt-10 rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02)),radial-gradient(circle_at_24%_20%,rgba(119,241,255,0.18),transparent_22%),radial-gradient(circle_at_74%_32%,rgba(125,93,255,0.18),transparent_20%),#090b11] p-6">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
              Future media slot
            </p>
            <div className="mt-4 h-[22rem] rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.03)]" />
          </div>
          <div className="mt-10 max-w-3xl space-y-5 text-base leading-8 text-[var(--soft-foreground)]">
            {work.body.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Link
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-3 text-sm transition hover:border-[var(--border-strong)] hover:bg-[var(--panel)]"
            href="/"
          >
            Back home
            <span aria-hidden="true">/</span>
          </Link>
        </section>
        <SiteFooter />
      </div>
    </main>
  );
}
