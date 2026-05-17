import type { ReactNode } from "react";

type SocialLinksProps = {
  className?: string;
  compact?: boolean;
  itemClassName?: string;
};

type SocialLink = {
  href: string;
  icon: ReactNode;
  label: string;
};

const links: SocialLink[] = [
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
    icon: (
      <path
        d="M12 7.25A4.75 4.75 0 1 0 16.75 12 4.76 4.76 0 0 0 12 7.25Zm0 7.9A3.15 3.15 0 1 1 15.15 12 3.16 3.16 0 0 1 12 15.15ZM17.45 7.1a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1Zm3.12 1.12a5.44 5.44 0 0 0-1.49-3.85 5.47 5.47 0 0 0-3.85-1.49C13.71 2.8 10.3 2.8 8.77 2.88a5.45 5.45 0 0 0-3.85 1.49A5.44 5.44 0 0 0 3.43 8.22c-.08 1.53-.08 4.95 0 6.48a5.44 5.44 0 0 0 1.49 3.85 5.46 5.46 0 0 0 3.85 1.49c1.53.08 4.94.08 6.46 0a5.46 5.46 0 0 0 3.85-1.49 5.44 5.44 0 0 0 1.49-3.85c.08-1.53.08-4.95 0-6.48Zm-1.9 7.46a3.83 3.83 0 0 1-2.15 2.15c-1.49.59-5.03.45-6.52.45s-5.04.12-6.53-.45a3.83 3.83 0 0 1-2.15-2.15c-.59-1.48-.45-5.03-.45-6.52s-.12-5.03.45-6.52a3.83 3.83 0 0 1 2.15-2.15c1.49-.59 5.04-.45 6.53-.45s5.03-.12 6.52.45a3.83 3.83 0 0 1 2.15 2.15c.59 1.49.45 5.03.45 6.52s.12 5.04-.45 6.52Z"
        fill="currentColor"
      />
    ),
  },
  {
    href: "https://www.threads.com/",
    label: "Threads",
    icon: (
      <path
        d="M14.89 11.52a3.63 3.63 0 0 0-.35-.1 6.64 6.64 0 0 0-.28-1.34 3.14 3.14 0 0 0-3.17-2.29 3.4 3.4 0 0 0-3.39 2.61l1.44.39a1.94 1.94 0 0 1 1.93-1.52c1.07 0 1.61.48 1.89 1.34a8.91 8.91 0 0 0-1.55-.12c-2.19 0-3.68 1-3.68 2.69 0 1.47 1.17 2.43 2.92 2.43a3.06 3.06 0 0 0 2.65-1.27 3.33 3.33 0 0 1-2.84 2.02 4.57 4.57 0 0 1-4.81-4.83 4.71 4.71 0 0 1 4.95-4.87 5.54 5.54 0 0 1 3.71 1.3 5.12 5.12 0 0 1 1.62 3.8 4.56 4.56 0 0 1-4.76 4.68 4.29 4.29 0 0 1-3.03-1.08l-.96 1.13a5.57 5.57 0 0 0 4.08 1.48A6.01 6.01 0 0 0 18.1 13c0-1.23-.69-1.97-2.21-2.48Zm-3.37 2.9c-.83 0-1.34-.34-1.34-.98s.65-1.07 1.86-1.07a6.03 6.03 0 0 1 1.29.13c-.15 1.05-.75 1.92-1.81 1.92Z"
        fill="currentColor"
      />
    ),
  },
  {
    href: "https://x.com/",
    label: "X",
    icon: (
      <path
        d="M18.9 3h2.77l-6.05 6.91L22.74 21h-5.58l-4.37-5.71L7.8 21H5.02l6.47-7.39L1 3h5.72l3.95 5.22L18.9 3Zm-.98 16.32h1.53L5.88 4.59H4.24Z"
        fill="currentColor"
      />
    ),
  },
  {
    href: "https://www.youtube.com/",
    label: "YouTube",
    icon: (
      <path
        d="M21.53 7.16a2.95 2.95 0 0 0-2.07-2.09C17.64 4.57 12 4.57 12 4.57s-5.64 0-7.46.5A2.95 2.95 0 0 0 2.47 7.16 30.88 30.88 0 0 0 2 12a30.88 30.88 0 0 0 .47 4.84 2.95 2.95 0 0 0 2.07 2.09c1.82.5 7.46.5 7.46.5s5.64 0 7.46-.5a2.95 2.95 0 0 0 2.07-2.09A30.88 30.88 0 0 0 22 12a30.88 30.88 0 0 0-.47-4.84ZM10.2 14.97V9.03L15.43 12Z"
        fill="currentColor"
      />
    ),
  },
];

export function SocialLinks({
  className = "",
  compact = false,
  itemClassName = "",
}: SocialLinksProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      {links.map((link) => (
        <a
          key={link.label}
          aria-label={link.label}
          className={`inline-flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--soft-foreground)] transition hover:border-[var(--border-strong)] hover:text-[var(--foreground)] ${
            compact ? "h-10 w-10" : "h-11 w-11"
          } ${itemClassName}`.trim()}
          href={link.href}
          rel="noreferrer"
          target="_blank"
        >
          <svg
            aria-hidden="true"
            className={compact ? "h-[18px] w-[18px]" : "h-5 w-5"}
            fill="none"
            viewBox="0 0 24 24"
          >
            {link.icon}
          </svg>
        </a>
      ))}
    </div>
  );
}
