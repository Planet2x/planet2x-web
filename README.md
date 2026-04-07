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
- a real BigQuery-backed game-events pipeline with controlled fallback to mock

It intentionally does not include:

- a public marketing site rebuild
- authentication frameworks
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
- lib/cockpit/bigquery/client.ts

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

For game-events, real mode now works when local BigQuery config is present.
If config is missing or the query fails, the endpoint logs the error and falls
back to mock data while health reports the current backend state.

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

Real mode uses these BigQuery views:

- v_lp_daily_overview_30d
- v_lp_progression_funnel_7d

The daily overview query reads the last 30 rows from the overview view.
The progression funnel query reads ordered funnel rows from the 7-day view.
Quick-read values are derived from those results on the server.

Environment behavior in v1:

- all uses the shared query results directly
- xcode/testflight/appstore currently return the same real dataset
- the filtering hook exists in code so environment-specific logic can be added later without changing the route shape

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

## BigQuery Client

The BigQuery client lives in:

- lib/cockpit/bigquery/client.ts

It is initialized as a singleton and uses:

- COCKPIT_GCP_PROJECT_ID for project selection
- GOOGLE_APPLICATION_CREDENTIALS for local service-account auth

No credentials are stored in the repo. The backend relies on the standard
Google client library behavior to load the JSON credentials file locally.

## Local Credential Configuration

Add local values in .env.local:

- COCKPIT_GAME_EVENTS_SOURCE=real
- COCKPIT_GCP_PROJECT_ID=your-project-id
- COCKPIT_BQ_DATASET=analytics_XXXXXXXX
- GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json

Important:

- never commit real credentials
- keep the service-account JSON outside the repo when possible
- .gitignore now excludes JSON files to reduce accidental commits

## Health Endpoint

GET /api/cockpit/health reports compact operational backend state, including:

- summarySourceMode
- summaryBackendStatus
- gameEventsSourceMode
- gameEventsBackendStatus
- gameEventsProjectId
- gameEventsDataset
- notes describing fallback or integration state

This keeps clients informed when mock mode is active, when real mode is ready,
or when the real query path failed and the API fell back to mock data.

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
- COCKPIT_GCP_PROJECT_ID
- COCKPIT_BQ_DATASET
- GOOGLE_APPLICATION_CREDENTIALS
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

Authorized game-events check:

~~~bash
curl \
  -H "Authorization: Bearer $COCKPIT_API_BEARER_TOKEN" \
  "http://localhost:3000/api/cockpit/game-events"
~~~

Authorized game-events with environment:

~~~bash
curl \
  -H "Authorization: Bearer $COCKPIT_API_BEARER_TOKEN" \
  "http://localhost:3000/api/cockpit/game-events?environment=appstore"
~~~

Inspect health:

~~~bash
curl \
  -H "Authorization: Bearer $COCKPIT_API_BEARER_TOKEN" \
  "http://localhost:3000/api/cockpit/health"
~~~

Mock mode testing:

~~~bash
COCKPIT_GAME_EVENTS_SOURCE=mock npm run dev
~~~

Real mode testing:

~~~bash
COCKPIT_GAME_EVENTS_SOURCE=real npm run dev
~~~

## Notes

- Public Planet2x pages are intentionally not part of this step.
- The API layer is read-only operational JSON for mobile and macOS clients.
- Mock mode remains the safe default.
- The new domain pattern is meant to grow carefully into adjacent read-only
  domains such as Sales and Ads without redesigning the route layer.
