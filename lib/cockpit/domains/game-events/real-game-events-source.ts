import { getBigQueryClient } from "@/lib/cockpit/bigquery/client";
import type { RealGameEventsConfiguration } from "@/lib/cockpit/config";
import type {
  GameEventsDailyOverviewRow,
  GameEventsEnvironment,
  GameEventsProgressionRow,
  GameEventsQuickRead,
  GameEventsSnapshot,
  GameEventsSource,
} from "@/lib/cockpit/domains/game-events/types";

const GAME = "Liquid Path";

type BigQueryDailyOverviewRow = {
  event_date: string | Date | { value: string };
  active_users: number | string;
  first_step_events: number | string;
  finish_events: number | string;
  fall_events: number | string;
};

type BigQueryProgressionRow = {
  step: string;
  ord: number | string;
  runs_reached: number | string;
};

export class RealGameEventsSource implements GameEventsSource {
  constructor(private readonly configuration: RealGameEventsConfiguration) {}

  async getGameEvents(
    environment: GameEventsEnvironment,
  ): Promise<GameEventsSnapshot> {
    const missingConfiguration = [
      !this.configuration.googleCloudProjectId && "COCKPIT_GCP_PROJECT_ID",
      !this.configuration.bigQueryDataset && "COCKPIT_BQ_DATASET",
      !this.configuration.googleApplicationCredentials &&
        "GOOGLE_APPLICATION_CREDENTIALS",
    ].filter(Boolean);

    if (missingConfiguration.length > 0) {
      throw new Error(
        `Real game-events source is not configured. Missing: ${missingConfiguration.join(", ")}`,
      );
    }

    const dailyOverview = await this.fetchDailyOverview(environment);
    const progressionFunnel = await this.fetchProgressionFunnel(environment);
    const quickRead = buildQuickRead(dailyOverview, progressionFunnel);

    return {
      generatedAt: new Date().toISOString(),
      game: GAME,
      environment,
      quickRead,
      dailyOverview,
      progressionFunnel,
    };
  }

  private async fetchDailyOverview(
    environment: GameEventsEnvironment,
  ): Promise<GameEventsDailyOverviewRow[]> {
    const rows = await runQuery<BigQueryDailyOverviewRow>(`
      SELECT
        event_date,
        app_env,
        build_channel,
        active_users,
        first_step_events,
        finish_events,
        fall_events
      FROM \`${this.configuration.googleCloudProjectId}.${this.configuration.bigQueryDataset}.v_lp_daily_overview_30d\`
      ${environmentWhereClause(environment)}
      ORDER BY event_date DESC
      LIMIT 30
    `);

    return rows.map((row) => ({
      date: normalizeDate(row.event_date),
      activeUsers: normalizeNumber(row.active_users),
      firstStep: normalizeNumber(row.first_step_events),
      finish: normalizeNumber(row.finish_events),
      falls: normalizeNumber(row.fall_events),
    }));
  }

  private async fetchProgressionFunnel(
    environment: GameEventsEnvironment,
  ): Promise<GameEventsProgressionRow[]> {
    const rows = await runQuery<BigQueryProgressionRow>(`
      SELECT
        step,
        ord,
        app_env,
        build_channel,
        runs_reached
      FROM \`${this.configuration.googleCloudProjectId}.${this.configuration.bigQueryDataset}.v_lp_progression_funnel_7d\`
      ${environmentWhereClause(environment)}
      ORDER BY ord ASC
    `);

    const normalizedRows = rows.map((row) => ({
      step: toProgressionStepLabel(row.step),
      ord: normalizeNumber(row.ord),
      runsReached: normalizeNumber(row.runs_reached),
    }));

    const firstStepRuns = normalizedRows[0]?.runsReached ?? 0;

    return normalizedRows.map((row) => ({
      step: row.step,
      runsReached: row.runsReached,
      progress:
        firstStepRuns > 0 ? row.runsReached / firstStepRuns : 0,
    }));
  }
}

async function runQuery<T>(query: string): Promise<T[]> {
  const client = getBigQueryClient();
  const [rows] = await client.query({ query, useLegacySql: false });
  return rows as T[];
}

function buildQuickRead(
  dailyOverview: GameEventsDailyOverviewRow[],
  progressionFunnel: GameEventsProgressionRow[],
): GameEventsQuickRead {
  const latestOverview = dailyOverview[0];
  const firstStep = progressionFunnel[0]?.runsReached ?? 0;
  const finalStep = progressionFunnel[progressionFunnel.length - 1];

  return {
    firstStep,
    planet2x: finalStep?.runsReached ?? 0,
    activeUsers: latestOverview?.activeUsers ?? 0,
    latestOverview: latestOverview?.date ?? "",
  };
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

function toProgressionStepLabel(step: string): string {
  const trimmedStep = step.trim();
  if (trimmedStep.length === 0) {
    return "—";
  }

  if (trimmedStep === "lp_first_step") {
    return "First Step";
  }

  if (trimmedStep === "lp_planet2x_reach") {
    return "Planet2x";
  }

  const midMatch = trimmedStep.match(/^lp_mid(\d+)_reach$/);
  if (midMatch) {
    return `Mid ${midMatch[1]}`;
  }

  return trimmedStep
    .replace(/^lp_/, "")
    .replace(/_reach$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function normalizeNumber(value: number | string): number {
  if (typeof value === "number") {
    return value;
  }

  return Number(value) || 0;
}

function normalizeDate(value: string | Date | { value: string }): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "object" && value !== null && "value" in value) {
    return String(value.value).slice(0, 10);
  }

  return String(value).slice(0, 10);
}
