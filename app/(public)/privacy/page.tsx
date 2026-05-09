import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPageBySlug } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy",
};

export default async function PrivacyPage() {
  const page = await getPageBySlug("privacy");

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-5xl px-6 py-6 sm:px-8 lg:px-10">
        <SiteHeader />
        <section className="border-t border-[var(--divider)] py-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--accent-soft)]">
            Planet2x
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            {page.title}
          </h1>
          <div className="mt-8 max-w-3xl space-y-5 text-base leading-8 text-[var(--soft-foreground)]">
            {page.body.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
        <SiteFooter />
      </div>
    </main>
  );
}
