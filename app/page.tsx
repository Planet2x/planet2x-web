import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const focusAreas = [
  "Public-facing website",
  "File-based publishing",
  "AI-assisted maintenance",
  "Future Cockpit-connected operations",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-8 lg:px-10">
        <SiteHeader />

        <section className="flex flex-1 flex-col justify-center py-16">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">
              Planet2x Web
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              A durable foundation for a visually led Planet2x website.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--soft-foreground)] sm:text-lg">
              This initial scaffold keeps the public site, file-based content,
              AI workflows, and operational docs in one maintainable system.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {focusAreas.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5"
              >
                <p className="text-sm text-[var(--soft-foreground)]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}

