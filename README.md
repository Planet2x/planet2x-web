# planet2x-web

`planet2x-web` is the long-term public web foundation for Planet2x.

It is intentionally more than a normal website repo, but less than a CMS. The
site, its file-based content, its operational documentation, and its AI working
rules live together so the system stays reviewable, maintainable, and easy to
evolve.

## Architecture idea

- `app/` contains the public Next.js App Router site.
- `components/` contains only reusable UI that earns its place.
- `content/` holds Markdown content with frontmatter for work entries, fragments, and generic pages.
- `docs/` stores internal documentation for architecture, publishing, SEO, QA, and decisions.
- `ai/` stores prompts, rules, and workflows for AI-assisted site work.
- `scripts/` holds lightweight maintenance and validation utilities.

The repo is designed so future Planet2x tooling, including Cockpit-assisted
content operations, can work with explicit files instead of opaque admin state.

## File-based content

Content lives in Markdown because it stays easy to edit, diff, review, and move
through automation. The starting model is intentionally small:

- `content/work/`
- `content/fragments/`
- `content/pages/`

Each entry uses readable frontmatter. New fields should only be added when real
content needs them across multiple entries.

## Why this is not a normal website repo

Most website repositories focus only on rendering pages. This one also treats
content operations, documentation, and AI collaboration as first-class parts of
the system.

That means:

- operational docs live alongside implementation
- AI prompts and rules are versioned in the repo
- content stays file-based rather than hidden behind a CMS
- maintenance scripts are kept close to the site

The result should be a calmer, more durable web system with less invisible
process.

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

- The visual layer is intentionally minimal in this first pass.
- There is no CMS integration.
- The current structure is meant to grow carefully, not quickly.
