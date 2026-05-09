# Cockpit Foundation

This repo still contains dormant cockpit/backend groundwork from an earlier
phase.

Preserved areas:

- `app/api/cockpit/*`
- `lib/cockpit/*`
- `.env.example` values related to cockpit backend work
- `@google-cloud/bigquery` in `package.json`

Why it is being preserved:

- it may still be useful as a future authenticated gateway
- it documents earlier operational backend assumptions
- deleting it now would create unnecessary churn while the public 0.x site is the focus

Current rule:

- do not expand this layer unless there is a specific backend task
- do not route new public-site work through cockpit modules
- keep any future private route areas clearly separated from the public site
