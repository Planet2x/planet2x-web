import type { RealGameEventsConfiguration } from "@/lib/cockpit/config";
import type {
  GameEventsEnvironment,
  GameEventsSnapshot,
  GameEventsSource,
} from "@/lib/cockpit/domains/game-events/types";

export class RealGameEventsSource implements GameEventsSource {
  constructor(
    private readonly configuration: RealGameEventsConfiguration,
    private readonly fallbackSource: GameEventsSource,
  ) {}

  async getGameEvents(
    environment: GameEventsEnvironment,
  ): Promise<GameEventsSnapshot> {
    const missingConfiguration = [
      !this.configuration.googleCloudProjectId && "GOOGLE_CLOUD_PROJECT_ID",
      !this.configuration.bigQueryDataset && "BIGQUERY_DATASET",
      !this.configuration.bigQueryGameEventsView && "BIGQUERY_GAME_EVENTS_VIEW",
    ].filter(Boolean);

    if (missingConfiguration.length > 0) {
      throw new Error(
        `Real game-events source is not configured. Missing: ${missingConfiguration.join(", ")}`,
      );
    }

    // BigQuery-backed game-events integration will be added here in the next
    // backend step. Keep query and transport details inside this domain source.
    return this.fallbackSource.getGameEvents(environment);
  }
}
