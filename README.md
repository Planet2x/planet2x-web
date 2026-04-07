# planet2x-web

planet2x-web is currently being used as the protected operational API
foundation for Planet2x Cockpit clients.

The public Planet2x site remains in Framer for now. This repo is not being used
to recreate the public website in this step. The current priority is a small,
Vercel-friendly Next.js App Router backend that serves protected JSON endpoints
to mobile and macOS cockpit clients.

## Current Scope

This repo currently provides:

- a minimal Next.js App Router foundation
- protected cockpit JSON endpoints under app/api/cockpit/*
- simple bearer-token protection via environment variable
- mock-backed operational responses that stay safe by default
- source-selection scaffolds for backend evolution without changing route shapes
- a reusable domain-module pattern for future read-only cockpit domains such as
  Game Events, Sales, and Ads

It intentionally does not include:

- a public marketing site rebuild
- authentication frameworks
- BigQuery querying
- a frontend dashboard

## Cockpit API Routes

Protected endpoints:

- GET /api/cockpit/summary
- GET /api/cockpit/funnel
- GET /api/cockpit/health
- GET /api/cockpit/game-events

These endpoints are backend-agnostic by design. They only return JSON and keep
transport, query, and source-selection details out of the route layer.

## Route Structure

Route handlers stay intentionally thin:

- bearer-token validation
- query param parsing and validation
- calling a cockpit domain pipeline
- returning JSON with Cache-Control: no-store

Current domain support includes:

- lib/cockpit/summary/*
- lib/cockpit/domains/game-events/*

The lib/cockpit/domains/<domain>/... pattern is intended to scale to future
read-only operational domains such as:

- lib/cockpit/domains/sales/*
- lib/cockpit/domains/ads/*

## Authentication

Cockpit endpoints require an Authorization header using the Bearer scheme.

The expected token is read from:

- COCKPIT_API_BEARER_TOKEN

If the bearer token is missing or invalid, the API returns 401.

If the server token is not configured at all, the API returns 500 with a clear
JSON error explaining that configuration is missing.

## Source Selection

Current source-selectable cockpit domains:

- summary
- game-events

Supported modes:

- mock
- real

Environment variables:

- COCKPIT_SUMMARY_SOURCE=mock|real
- COCKPIT_GAME_EVENTS_SOURCE=mock|real

Default behavior remains mock.

For game-events, mock remains the safe default and also acts as a controlled
fallback when real mode is selected without enough backend configuration. If
real mode is selected with configuration present, health reports that the
backend is ready for the next implementation step while the route continues to
serve stable mock data until query execution is added.

## Game Events Endpoint

Endpoint:

- GET /api/cockpit/game-events

Supported query parameter:

- environment=all|xcode|testflight|appstore

Default:

- environment=all

Invalid values return 400 JSON with a clear validation error.

Response shape:

- generatedAt
- game
- environment
- quickRead
- dailyOverview
- progressionFunnel

Example response:

~~~json
{
  "generatedAt": "2026-04-07T19:30:00Z",
  "game": "Liquid Path",
  "environment": "appstore",
  "quickRead": {
    "firstStep": 33,
    "planet2x": 3,
    "activeUsers": 2,
    "latestOverview": "2026-04-05"
  },
  "dailyOverview": [
    {
      "date": "2026-04-05",
      "activeUsers": 2,
      "firstStep": 28,
      "finish": 0,
      "falls": 28
    }
  ],
  "progressionFunnel": [
    {
      "step": "First Step",
      "runsReached": 33,
      "progress": 1
    },
    {
      "step": "Mid 2",
      "runsReached": 15,
      "progress": 0.455
    }
  ]
}
~~~

Mock snapshots differ by environment so mobile and macOS clients can verify
selector behavior visually during development.

## Real Backend Scaffold

The real backend path is intentionally only a scaffold in this step.

Expected configuration for the next implementation phase:

- GOOGLE_CLOUD_PROJECT_ID
- BIGQUERY_DATASET
- BIGQUERY_SUMMARY_VIEW
- BIGQUERY_GAME_EVENTS_VIEW
- optional service-account-related configuration such as
  GOOGLE_SERVICE_ACCOUNT_EMAIL

The route layer does not contain SQL or BigQuery-specific logic. That future
work belongs inside domain source modules such as:

- lib/cockpit/summary/real-summary-source.ts
- lib/cockpit/domains/game-events/real-game-events-source.ts

## Health Endpoint

GET /api/cockpit/health reports compact operational backend state, including:

- summarySourceMode
- summaryBackendStatus
- gameEventsSourceMode
- gameEventsBackendStatus
- notes describing fallback or integration state

This keeps clients informed when mock mode is active or when a real mode has
been selected but is not fully implemented yet.

## Local Development

Requirements:

- Node.js 20.9 or newer

Install dependencies:

~~~bash
npm install
~~~

Create a local env file:

~~~bash
cp .env.example .env.local
~~~

Set a bearer token in .env.local, then run locally:

~~~bash
npm run dev
~~~

Useful commands:

~~~bash
npm run typecheck
npm run validate:content
npm run build
~~~

## Required Environment Variables

Required:

- COCKPIT_API_BEARER_TOKEN

Optional:

- COCKPIT_API_TIMEOUT_MS
- COCKPIT_SUMMARY_SOURCE
- COCKPIT_GAME_EVENTS_SOURCE
- GOOGLE_CLOUD_PROJECT_ID
- BIGQUERY_DATASET
- BIGQUERY_SUMMARY_VIEW
- BIGQUERY_GAME_EVENTS_VIEW
- GOOGLE_SERVICE_ACCOUNT_EMAIL

## Local API Testing

Example curl commands after starting npm run dev.

Unauthorized check:

~~~bash
curl http://localhost:3000/api/cockpit/game-events
~~~

Authorized summary check:

~~~bash
curl \
  -H "Authorization: Bearer $COCKPIT_API_BEARER_TOKEN" \
  http://localhost:3000/api/cockpit/summary
~~~

Authorized game-events checks:

~~~bash
curl \
  -H "Authorization: Bearer $COCKPIT_API_BEARER_TOKEN" \
  http://localhost:3000/api/cockpit/game-events
~~~

~~~bash
curl \
  -H "Authorization: Bearer $COCKPIT_API_BEARER_TOKEN" \
  "http://localhost:3000/api/cockpit/game-events?environment=appstore"
~~~

Invalid environment check:

~~~bash
curl \
  -H "Authorization: Bearer $COCKPIT_API_BEARER_TOKEN" \
  "http://localhost:3000/api/cockpit/game-events?environment=staging"
~~~

Mock mode testing:

~~~bash
COCKPIT_SUMMARY_SOURCE=mock COCKPIT_GAME_EVENTS_SOURCE=mock npm run dev
~~~

Game-events real scaffold testing:

~~~bash
COCKPIT_GAME_EVENTS_SOURCE=real npm run dev
~~~

Then inspect health:

~~~bash
curl \
  -H "Authorization: Bearer $COCKPIT_API_BEARER_TOKEN" \
  http://localhost:3000/api/cockpit/health
~~~

## Notes

- Public Planet2x pages are intentionally not part of this step.
- The API layer is read-only operational JSON for mobile and macOS clients.
- Mock mode remains the safe default.
- The new domain pattern is meant to grow carefully into adjacent read-only
  domains such as Sales and Ads without redesigning the route layer.
