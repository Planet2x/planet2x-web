import { getBigQueryClient } from "@/lib/cockpit/bigquery/client";
import type { DashboardSummary } from "@/lib/cockpit/types";
import type { RealSummaryConfiguration } from "@/lib/cockpit/config";
import type { GameEventsEnvironment } from "@/lib/cockpit/domains/game-events/types";
import type { SummarySource } from "@/lib/cockpit/summary/types";

type BigQuerySummaryRow = {
  event_date: string | Date | { value: string };
  active_users: number | string;
  first_step_events: number | string;
  finish_events: number | string;
  fall_events: number | string;
};

export class RealSummarySource implements SummarySource {
  constructor(private readonly configuration: RealSummaryConfiguration) {}

  async getSummary(environment: GameEventsEnvironment): Promise<DashboardSummary> {
    const missingConfiguration = [
      !this.configuration.googleCloudProjectId && "COCKPIT_GCP_PROJECT_ID",
      !this.configuration.bigQueryDataset && "COCKPIT_BQ_DATASET",
      !this.configuration.bigQuerySummaryView && "BIGQUERY_SUMMARY_VIEW",
      !this.configuration.googleApplicationCredentials &&
        "GOOGLE_APPLICATION_CREDENTIALS",
    ].filter(Boolean);

    if (missingConfiguration.length > 0) {
      throw new Error(
        `Real summary source is not configured. Missing: ${missingConfiguration.join(", ")}`,
      );
    }

    const rows = await runQuery<BigQuerySummaryRow>(`
      SELECT
        app_env,
        build_channel,
        event_date,
        active_users,
        first_step_events,
        finish_events,
        fall_events
      FROM \`${this.configuration.googleCloudProjectId}.${this.configuration.bigQueryDataset}.${this.configuration.bigQuerySummaryView}\`
      ${environmentWhereClause(environment)}
      ORDER BY event_date DESC
      LIMIT 1
    `);

    const latestRow = rows[0];
    if (!latestRow) {
      throw new Error("Real summary query returned no rows.");
    }

    return {
      generatedAt: new Date().toISOString(),
      game: "Liquid Path",
      activeUsers: normalizeNumber(latestRow.active_users),
      firstStepUsers: normalizeNumber(latestRow.first_step_events),
      finishUsers: normalizeNumber(latestRow.finish_events),
      fallEvents: normalizeNumber(latestRow.fall_events),
    };
  }
}

function environmentWhereClause(environment: GameEventsEnvironment): string {
  switch (environment) {
    case "all":
      return "";
    case "xcode":
      return "WHERE app_env = 'dev' AND build_channel = 'xcode'";
    case "testflight":
      return "WHERE app_env = 'test' AND build_channel = 'testflight'";
    case "appstore":
      return "WHERE app_env = 'prod' AND build_channel = 'appstore'";
  }
}

async function runQuery<T>(query: string): Promise<T[]> {
  const client = getBigQueryClient();
  const [rows] = await client.query({ query, useLegacySql: false });
  return rows as T[];
}

function normalizeNumber(value: number | string): number {
  if (typeof value === "number") {
    return value;
  }

  return Number(value) || 0;
}
