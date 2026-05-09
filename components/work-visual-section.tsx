import Link from "next/link";

import type { ContentEntry } from "@/lib/content";
import { getFrontmatterText } from "@/lib/content";

type WorkVisualSectionProps = {
  first?: boolean;
  priority?: boolean;
  work: ContentEntry;
};

function buildMediaStyle(work: ContentEntry) {
  const image = getFrontmatterText(work.frontmatter, "visualImage");
  const tintA = getFrontmatterText(work.frontmatter, "visualTintA") || "#78efff";
  const tintB = getFrontmatterText(work.frontmatter, "visualTintB") || "#7d5dff";

  const layers = [
    "linear-gradient(180deg, rgba(3, 4, 7, 0.1), rgba(3, 4, 7, 0.68) 72%, rgba(3, 4, 7, 0.92))",
    `radial-gradient(circle at 20% 18%, ${hexToRgba(tintA, 0.28)}, transparent 24%)`,
    `radial-gradient(circle at 76% 28%, ${hexToRgba(tintB, 0.26)}, transparent 26%)`,
    "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02) 36%, rgba(255,255,255,0.02))",
  ];

  if (image) {
    layers.push(`url("${image}")`);
  } else {
    layers.push(
      "radial-gradient(circle at 42% 46%, rgba(255,255,255,0.12), transparent 12%)",
      "linear-gradient(145deg, rgba(8, 11, 18, 1), rgba(12, 16, 30, 1) 45%, rgba(4, 5, 9, 1))",
    );
  }

  return {
    backgroundImage: layers.join(", "),
    backgroundPosition: image ? "center, center, center, center, center" : undefined,
    backgroundSize: image ? "cover, cover, cover, cover, cover" : undefined,
  };
}

export function WorkVisualSection({
  first = false,
  priority = false,
  work,
}: WorkVisualSectionProps) {
  const tagline = getFrontmatterText(work.frontmatter, "homepageLine") || work.excerpt;
  const status = getFrontmatterText(work.frontmatter, "status");
  const year = getFrontmatterText(work.frontmatter, "year");
  const visualVideo = getFrontmatterText(work.frontmatter, "visualVideo");

  return (
    <section className={first ? "" : "border-t border-[var(--divider)]"}>
      <article className="relative isolate min-h-[88svh] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={buildMediaStyle(work)}
        />

        {visualVideo ? (
          <div className="absolute left-6 top-6 z-10 rounded-full border border-[var(--border)] bg-[rgba(5,7,10,0.55)] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[var(--soft-foreground)]">
            Future video: {visualVideo}
          </div>
        ) : null}

        {!visualVideo ? (
          <div className="absolute left-6 top-6 z-10 rounded-full border border-[var(--border)] bg-[rgba(5,7,10,0.55)] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[var(--soft-foreground)]">
            Placeholder visual
          </div>
        ) : null}

        <div
          className={`relative z-10 mx-auto flex min-h-[88svh] max-w-7xl items-end px-6 py-10 sm:px-8 lg:px-10 ${
            first ? "pt-32 sm:pt-36" : ""
          }`}
        >
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--accent-soft)]">
              {status} / {year}
            </p>
            <h2
              className={`mt-4 max-w-3xl font-semibold tracking-[-0.05em] text-balance ${
                priority ? "text-5xl sm:text-7xl" : "text-4xl sm:text-6xl"
              }`}
            >
              {work.title}
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-[var(--soft-foreground)] sm:text-lg">
              {tagline}
            </p>
            <Link
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[rgba(4,6,10,0.44)] px-5 py-3 text-sm text-[var(--foreground)] transition hover:border-[var(--border-strong)] hover:bg-[rgba(255,255,255,0.08)]"
              href={`/work/${work.slug}`}
            >
              View details
              <span aria-hidden="true">/</span>
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) {
    return `rgba(255,255,255,${alpha})`;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
