import type { ComponentType, SVGProps } from "react";

type SocialLinksProps = {
  className?: string;
  compact?: boolean;
  itemClassName?: string;
};

type IconProps = SVGProps<SVGSVGElement>;

type SocialLink = {
  href: string;
  icon: ComponentType<IconProps>;
  label: string;
};

const links: SocialLink[] = [
  {
    href: "https://www.instagram.com/",
    icon: InstagramIcon,
    label: "Instagram",
  },
  {
    href: "https://www.threads.com/",
    icon: ThreadsIcon,
    label: "Threads",
  },
  {
    href: "https://x.com/",
    icon: XIcon,
    label: "X",
  },
  {
    href: "https://www.youtube.com/",
    icon: YouTubeIcon,
    label: "YouTube",
  },
];

export function SocialLinks({
  className = "",
  compact = false,
  itemClassName = "",
}: SocialLinksProps) {
  const iconSizeClassName = compact ? "h-[18px] w-[18px]" : "h-5 w-5";

  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      {links.map((link) => {
        const Icon = link.icon;

        return (
          <a
            key={link.label}
            aria-label={link.label}
            className={`inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--soft-foreground)] transition hover:border-[var(--border-strong)] hover:text-[var(--foreground)] ${
              compact ? "h-10 w-10" : "h-11 w-11"
            } ${itemClassName}`.trim()}
            href={link.href}
            rel="noreferrer"
            target="_blank"
          >
            <Icon
              aria-hidden="true"
              className={iconSizeClassName}
              focusable="false"
            />
          </a>
        );
      })}
    </div>
  );
}

function InstagramIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <rect
        height="15.5"
        rx="4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        width="15.5"
        x="4.25"
        y="4.25"
      />
      <circle cx="12" cy="12" r="3.45" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="16.65" cy="7.35" fill="currentColor" r="1.05" />
    </svg>
  );
}

function ThreadsIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M17.7 10.8c-.2-3.5-2.2-5.6-5.5-5.6-3.7 0-6.2 2.7-6.2 6.8 0 4.2 2.5 6.8 6.5 6.8 2.6 0 4.6-1.2 5.5-3.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
      <path
        d="M9.2 10.1c.5-1.2 1.5-1.8 3-1.8 2.1 0 3.2 1.3 3.2 3.7 0 2.7-1.3 4.2-3.6 4.2-1.6 0-2.7-.8-2.7-2 0-1.3 1.1-2 3.2-2 .9 0 2 .2 3.2.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function XIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="m5 5 14 14M19 5 5 19"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function YouTubeIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M21 12c0 2.1-.2 3.5-.5 4.3-.3.8-.9 1.3-1.7 1.5-1.3.4-3.6.5-6.8.5s-5.5-.1-6.8-.5c-.8-.2-1.4-.7-1.7-1.5C3.2 15.5 3 14.1 3 12s.2-3.5.5-4.3c.3-.8.9-1.3 1.7-1.5 1.3-.4 3.6-.5 6.8-.5s5.5.1 6.8.5c.8.2 1.4.7 1.7 1.5.3.8.5 2.2.5 4.3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
      <path d="m10.4 9.2 4.6 2.8-4.6 2.8V9.2Z" fill="currentColor" />
    </svg>
  );
}
