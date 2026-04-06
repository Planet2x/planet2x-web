# planet2x-web

`planet2x-web` is currently being used as the first protected API foundation
for Planet2x Cockpit mobile integration.

The public Planet2x site remains in Framer for now. This repo is not being used
to recreate the public website in this step. The current priority is a small,
Vercel-friendly Next.js App Router backend that can later serve protected JSON
endpoints to `planet2x-cockpit-ios`.

## Current Scope

This repo currently provides:

- a minimal Next.js App Router foundation
- protected cockpit JSON endpoints under `app/api/cockpit/*`
- simple bearer-token protection via environment variable
- static mock responses that match the current iOS app models
- a summary data-source pipeline that supports `mock` and `real` source modes

It intentionally does not include:

- a public marketing site rebuild
- authentication frameworks
- BigQuery integration
- a frontend dashboard

## Cockpit API Routes

Protected endpoints:

- `GET /api/cockpit/summary`
- `GET /api/cockpit/funnel`
- `GET /api/cockpit/health`

Current server-side support files:

- `lib/cockpit/auth.ts`
- `lib/cockpit/config.ts`
- `lib/cockpit/mock-data.ts`
- `lib/cockpit/types.ts`
- `lib/cockpit/summary/types.ts`
- `lib/cockpit/summary/mock-summary-source.ts`
- `lib/cockpit/summary/real-summary-source.ts`
- `lib/cockpit/summary/get-summary.ts`

These endpoints are backend-agnostic by design. They only return JSON and do
not embed any BigQuery-specific logic into the route layer.

## Authentication

Cockpit endpoints require:

- `Authorization: Bearer <token>`

The expected token is read from:

- `COCKPIT_API_BEARER_TOKEN`

If the bearer token is missing or invalid, the API returns `401`.

If the server token is not configured at all, the API returns `500` with a
clear JSON error explaining that configuration is missing.

## Summary Source Selection

`/api/cockpit/summary` now runs through a small source-selection pipeline.

Supported modes:

- `mock`
- `real`

Source mode is selected through:

- `COCKPIT_SUMMARY_SOURCE=mock|real`

Default behavior remains:

- `mock`

If `COCKPIT_SUMMARY_SOURCE=real` is selected but the expected BigQuery-related
configuration is incomplete, the summary pipeline falls back to mock data while
reporting the backend state through `/api/cockpit/health`.

## Mock Data

All cockpit endpoints currently return static mock JSON shaped for the iOS app:

- `summary`
  fields: `generatedAt`, `game`, `activeUsers`, `firstStepUsers`, `finishUsers`, `fallEvents`
- `funnel`
  fields: `generatedAt`, `game`, `steps`
- `health`
  fields: `generatedAt`, `apiStatus`, `dataSource`, `notes`

This keeps the mobile app fully testable while the protected backend is still
being scaffolded.

## Real Summary Scaffold

The real summary path is intentionally only a scaffold in this step.

Expected configuration for the next implementation phase:

- `GOOGLE_CLOUD_PROJECT_ID`
- `BIGQUERY_DATASET`
- `BIGQUERY_SUMMARY_VIEW`
- optional service-account-related configuration such as
  `GOOGLE_SERVICE_ACCOUNT_EMAIL`

The route layer does not contain SQL or BigQuery-specific logic. That future
work belongs in `lib/cockpit/summary/real-summary-source.ts`.

## Next Backend Phase

The next backend step is to replace the mock responses with real protected data
sources, likely BigQuery-backed summaries exposed through these same JSON
endpoints on Vercel.

## Local Development

Requirements:

- Node.js 20.9 or newer

Install dependencies:

```bash
npm install
```

Create a local env file:

```bash
cp .env.example .env.local
```

Set a bearer token in `.env.local`, then run locally:

```bash
npm run dev
```

Useful commands:

```bash
npm run typecheck
npm run validate:content
npm run build
```

## Required Environment Variables

- `COCKPIT_API_BEARER_TOKEN`

Optional:

- `COCKPIT_API_TIMEOUT_MS`
- `COCKPIT_SUMMARY_SOURCE`
- `GOOGLE_CLOUD_PROJECT_ID`
- `BIGQUERY_DATASET`
- `BIGQUERY_SUMMARY_VIEW`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`

## Local API Testing

Example `curl` commands after starting `npm run dev`:

```bash
curl http://localhost:3000/api/cockpit/summary
```

Expected response: `401`

```bash
curl \
  -H "Authorization: Bearer $COCKPIT_API_BEARER_TOKEN" \
  http://localhost:3000/api/cockpit/summary
```

Test default mock summary mode:

```bash
COCKPIT_SUMMARY_SOURCE=mock npm run dev
```

Test real summary scaffold mode with safe fallback:

```bash
COCKPIT_SUMMARY_SOURCE=real npm run dev
```

Then inspect health:

```bash
curl \
  -H "Authorization: Bearer $COCKPIT_API_BEARER_TOKEN" \
  http://localhost:3000/api/cockpit/health
```

In `real` mode without full BigQuery config, health will report:

- `summarySourceMode: "real"`
- `summaryBackendStatus: "real-not-configured"`

```bash
curl \
  -H "Authorization: Bearer $COCKPIT_API_BEARER_TOKEN" \
  http://localhost:3000/api/cockpit/funnel
```

```bash
curl \
  -H "Authorization: Bearer $COCKPIT_API_BEARER_TOKEN" \
  http://localhost:3000/api/cockpit/health
```

## Notes

- Public Planet2x pages are intentionally not part of this step.
- The summary route now supports backend source selection while preserving the
  same JSON response shape for the iOS app.
- The API layer is still safe by default because mock mode remains the default.
- The current structure is meant to grow carefully, not quickly.
