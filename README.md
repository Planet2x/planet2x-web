# planet2x-web

`planet2x-web` is the safe 0.x rebuild of the Planet2x public website.

The live production site remains in Framer at [planet2x.com](https://planet2x.com).
This Next.js App Router version is being developed in parallel for Vercel. No
domain switch is part of this phase.

## Current direction

- public-facing Planet2x site only
- file-based content that is easy for humans and AI to maintain
- lightweight, production-minded Next.js foundation
- no CMS
- no auth
- no database
- no Cockpit API integration in the public site layer yet

The visual direction follows the newer Lumen Path identity: luminous,
cinematic, minimal, modern, AI-native, and atmospheric.

## Repo shape

- `app/`: public site routes and preserved API routes
- `components/`: small reusable UI pieces only
- `content/`: Markdown content with frontmatter
- `docs/`: internal architecture, publishing, SEO, QA, and decisions
- `ai/`: prompts, rules, and workflows for AI-assisted web work
- `scripts/`: lightweight validation and maintenance utilities
- `lib/`: content loading and preserved cockpit/backend modules

## Public site vs preserved cockpit work

This repo already contained dormant cockpit/backend groundwork. That work is
being preserved instead of deleted blindly.

Current separation:

- `app/(public)/` is the active public-site surface
- `app/api/cockpit/*` and `lib/cockpit/*` remain preserved future groundwork

This keeps the 0.x rebuild focused while leaving room for future protected areas
such as `/studio`, `/cockpit`, or `/admin`.

## File-based content

Content stays close to the repo so it can be edited, diffed, reviewed, and
automated without introducing a CMS.

Current content folders:

- `content/work/`
- `content/fragments/`
- `content/pages/`

The homepage and work list are intentionally easy to continue in small patches.

## Local development

Requirements:

- Node.js 20.9 or newer

Install dependencies:

```bash
npm install
```

Run the site:

```bash
npm run dev
```

Useful commands:

```bash
npm run typecheck
npm run validate:content
npm run build
```

## Notes

- Framer remains the live production website.
- This repo is the parallel 0.x Vercel rebuild.
- No domain switch is part of this phase.
- Keep changes small, calm, and maintainable.
