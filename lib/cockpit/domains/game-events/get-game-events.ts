import {
  getCockpitGameEventsSourceMode,
  getRealGameEventsConfiguration,
} from "@/lib/cockpit/config";
import { MockGameEventsSource } from "@/lib/cockpit/domains/game-events/mock-game-events-source";
import { RealGameEventsSource } from "@/lib/cockpit/domains/game-events/real-game-events-source";
import type {
  GameEventsEnvironment,
  GameEventsSnapshot,
  GameEventsSource,
  GameEventsSourceState,
} from "@/lib/cockpit/domains/game-events/types";

let lastObservedState: GameEventsSourceState | null = null;

export async function getGameEvents(
  environment: GameEventsEnvironment,
): Promise<GameEventsSnapshot> {
  const resolved = resolveGameEventsSource();

  if (resolved.state.backendStatus === "mock") {
    lastObservedState = resolved.state;
    return resolved.source.getGameEvents(environment);
  }

  if (resolved.state.backendStatus === "real-not-configured") {
    lastObservedState = resolved.state;
    return resolved.fallbackSource.getGameEvents(environment);
  }

  try {
    const snapshot = await resolved.source.getGameEvents(environment);
    lastObservedState = resolved.state;
    return snapshot;
  } catch (error) {
    console.error("[cockpit] real game-events query failed", error);

    lastObservedState = {
      mode: "real",
      backendStatus: "real-error",
      notes:
        error instanceof Error
          ? `Real game-events query failed. Falling back to mock data. ${error.message}`
          : "Real game-events query failed. Falling back to mock data.",
      projectId: resolved.state.projectId,
      dataset: resolved.state.dataset,
    };

    return resolved.fallbackSource.getGameEvents(environment);
  }
}

export function getGameEventsSourceState(): GameEventsSourceState {
  return lastObservedState ?? resolveGameEventsSource().state;
}

function resolveGameEventsSource(): {
  source: GameEventsSource;
  fallbackSource: GameEventsSource;
  state: GameEventsSourceState;
} {
  const mode = getCockpitGameEventsSourceMode();
  const mockSource = new MockGameEventsSource();
  const configuration = getRealGameEventsConfiguration();

  if (mode === "real") {
    const isConfigured = Boolean(
      configuration.googleCloudProjectId &&
        configuration.bigQueryDataset &&
        configuration.googleApplicationCredentials,
    );

    if (isConfigured) {
      return {
        source: new RealGameEventsSource(configuration),
        fallbackSource: mockSource,
        state: {
          mode,
          backendStatus: "real-ready",
          notes:
            "Real game-events mode is selected and BigQuery configuration is present.",
          projectId: configuration.googleCloudProjectId,
          dataset: configuration.bigQueryDataset,
        },
      };
    }

    return {
      source: mockSource,
      fallbackSource: mockSource,
      state: {
        mode,
        backendStatus: "real-not-configured",
        notes:
          "Real game-events mode is selected, but BigQuery configuration is incomplete. Falling back to mock game-events data.",
        projectId: configuration.googleCloudProjectId,
        dataset: configuration.bigQueryDataset,
      },
    };
  }

  return {
    source: mockSource,
    fallbackSource: mockSource,
    state: {
      mode,
      backendStatus: "mock",
      notes: "Mock game-events mode is active.",
      projectId: configuration.googleCloudProjectId,
      dataset: configuration.bigQueryDataset,
    },
  };
}
