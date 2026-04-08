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
  date: string | Date | { value: string };
  active_users: number | string;
  first_step: number | string;
  finish: number | string;
  falls: number | string;
};

type BigQueryProgressionRow = {
  step: string;
  runs_reached: number | string;
  progress: number | string;
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

    const dailyOverview = await this.fetchDailyOverview();
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

  private async fetchDailyOverview(): Promise<GameEventsDailyOverviewRow[]> {
    const rows = await runQuery<BigQueryDailyOverviewRow>(`
      SELECT
        date,
        active_users,
        first_step,
        finish,
        falls
      FROM \`${this.configuration.googleCloudProjectId}.${this.configuration.bigQueryDataset}.v_lp_daily_overview_30d\`
      ORDER BY date DESC
      LIMIT 30
    `);

    return rows.map((row) => ({
      date: normalizeDate(row.date),
      activeUsers: normalizeNumber(row.active_users),
      firstStep: normalizeNumber(row.first_step),
      finish: normalizeNumber(row.finish),
      falls: normalizeNumber(row.falls),
    }));
  }

  private async fetchProgressionFunnel(
    environment: GameEventsEnvironment,
  ): Promise<GameEventsProgressionRow[]> {
    const rows = await runQuery<BigQueryProgressionRow>(`
      SELECT
        step,
        runs_reached,
        progress
      FROM \`${this.configuration.googleCloudProjectId}.${this.configuration.bigQueryDataset}.v_lp_progression_funnel_7d\`
      ORDER BY step_order ASC
    `);

    return applyEnvironmentFilter(
      rows.map((row) => ({
        step: toProgressionStepLabel(row.step),
        runsReached: normalizeNumber(row.runs_reached),
        progress: normalizeFloat(row.progress),
      })),
      environment,
    );
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

function applyEnvironmentFilter(
  rows: GameEventsProgressionRow[],
  environment: GameEventsEnvironment,
): GameEventsProgressionRow[] {
  // v1 keeps the same query results for every non-all environment. This hook
  // exists so environment-specific filtering can be added later without
  // changing the route or response shape.
  void environment;
  return rows;
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

function normalizeFloat(value: number | string): number {
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
