# Architecture

Status: `ACTIVE 0.x PUBLIC REBUILD`

This repository currently carries two layers:

- the new public-facing Next.js site being rebuilt in parallel with the live Framer site
- dormant but preserved cockpit/backend groundwork under `app/api/cockpit/*` and `lib/cockpit/*`

Current public-site boundaries:

- Framer remains live at `https://planet2x.com`
- this Vercel/Next.js version is a safe parallel rebuild
- no domain switch yet
- no CMS, auth, database, or Cockpit API integration in the public site layer yet

Future flexibility:

- keep the public site file-based and easy to evolve in small patches
- leave room for future protected route areas such as `/studio`, `/cockpit`, and `/admin`
- preserve existing cockpit code and document its role instead of deleting it blindly

Use this space for the site-level technical picture:

- routing structure
- rendering strategy
- content loading approach
- future integrations such as Cockpit-assisted operations
- deployment assumptions and environment boundaries

Keep the notes practical. Capture why the system is shaped the way it is, not
just what folders exist.

Current route stance:

- `app/(public)/` is the active public-site surface
- `app/api/cockpit/*` remains preserved backend groundwork
- future authenticated areas should be added as explicit sibling routes rather than being mixed into the public site
