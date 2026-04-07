const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_SUMMARY_SOURCE = "mock";
const DEFAULT_GAME_EVENTS_SOURCE = "mock";

export type CockpitSummarySourceMode = "mock" | "real";
export type CockpitGameEventsSourceMode = "mock" | "real";

export type RealSummaryConfiguration = {
  googleCloudProjectId: string | null;
  bigQueryDataset: string | null;
  bigQuerySummaryView: string | null;
  googleServiceAccountEmail: string | null;
};

export type RealGameEventsConfiguration = {
  googleCloudProjectId: string | null;
  bigQueryDataset: string | null;
  googleApplicationCredentials: string | null;
};

export function getCockpitBearerToken(): string | null {
  const token = process.env.COCKPIT_API_BEARER_TOKEN?.trim();
  return token ? token : null;
}

export function getCockpitRequestTimeoutMs(): number {
  const rawValue = process.env.COCKPIT_API_TIMEOUT_MS?.trim();
  const parsed = rawValue ? Number(rawValue) : Number.NaN;

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_TIMEOUT_MS;
  }

  return parsed;
}

export function getCockpitSummarySourceMode(): CockpitSummarySourceMode {
  const rawValue = process.env.COCKPIT_SUMMARY_SOURCE?.trim().toLowerCase();

  if (rawValue === "real") {
    return "real";
  }

  return DEFAULT_SUMMARY_SOURCE;
}

export function getCockpitGameEventsSourceMode(): CockpitGameEventsSourceMode {
  const rawValue = process.env.COCKPIT_GAME_EVENTS_SOURCE?.trim().toLowerCase();

  if (rawValue === "real") {
    return "real";
  }

  return DEFAULT_GAME_EVENTS_SOURCE;
}

export function getRealSummaryConfiguration(): RealSummaryConfiguration {
  return {
    googleCloudProjectId: readOptionalEnv("GOOGLE_CLOUD_PROJECT_ID"),
    bigQueryDataset: readOptionalEnv("BIGQUERY_DATASET"),
    bigQuerySummaryView: readOptionalEnv("BIGQUERY_SUMMARY_VIEW"),
    googleServiceAccountEmail: readOptionalEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
  };
}

export function getRealGameEventsConfiguration(): RealGameEventsConfiguration {
  return {
    googleCloudProjectId:
      readOptionalEnv("COCKPIT_GCP_PROJECT_ID") ??
      readOptionalEnv("GOOGLE_CLOUD_PROJECT_ID"),
    bigQueryDataset:
      readOptionalEnv("COCKPIT_BQ_DATASET") ?? readOptionalEnv("BIGQUERY_DATASET"),
    googleApplicationCredentials: readOptionalEnv(
      "GOOGLE_APPLICATION_CREDENTIALS",
    ),
  };
}

function readOptionalEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}
