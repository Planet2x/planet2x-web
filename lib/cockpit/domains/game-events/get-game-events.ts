import {
  getCockpitGameEventsSourceMode,
  getRealGameEventsConfiguration,
} from "@/lib/cockpit/config";
import { MockGameEventsSource } from "@/lib/cockpit/domains/game-events/mock-game-events-source";
import { RealGameEventsSource } from "@/lib/cockpit/domains/game-events/real-game-events-source";
import type {
  GameEventsEnvironment,
  GameEventsResponse,
  GameEventsSnapshot,
  GameEventsSource,
  GameEventsSourceState,
} from "@/lib/cockpit/domains/game-events/types";

let lastObservedState: GameEventsSourceState | null = null;

export async function getGameEvents(
  environment: GameEventsEnvironment,
): Promise<GameEventsResponse> {
  const resolved = resolveGameEventsSource();

  if (resolved.state.backendStatus === "mock") {
    const snapshot = await resolved.source.getGameEvents(environment);
    const response = withSourceMetadata(snapshot, {
      sourceUsed: "mock",
      backendStatus: "mock",
      backendNote: "Mock game-events mode is active.",
    });

    lastObservedState = {
      ...resolved.state,
      lastResponseStatus: response.backendStatus,
      lastSourceUsed: response.sourceUsed,
      lastBackendNote: response.backendNote,
    };

    return response;
  }

  if (resolved.state.backendStatus === "real-not-configured") {
    const snapshot = await resolved.fallbackSource.getGameEvents(environment);
    const response = withSourceMetadata(snapshot, {
      sourceUsed: "mock",
      backendStatus: "real-not-configured",
      backendNote:
        "Real game-events mode is selected, but BigQuery configuration is incomplete. Serving mock fallback data.",
    });

    lastObservedState = {
      ...resolved.state,
      notes: response.backendNote,
      lastResponseStatus: response.backendStatus,
      lastSourceUsed: response.sourceUsed,
      lastBackendNote: response.backendNote,
    };

    return response;
  }

  try {
    const snapshot = await resolved.source.getGameEvents(environment);
    const response = withSourceMetadata(snapshot, {
      sourceUsed: "real",
      backendStatus: "real-success",
      backendNote: "Real BigQuery game-events data returned successfully.",
    });

    lastObservedState = {
      ...resolved.state,
      notes: response.backendNote,
      lastResponseStatus: response.backendStatus,
      lastSourceUsed: response.sourceUsed,
      lastBackendNote: response.backendNote,
    };

    return response;
  } catch (error) {
    console.error("[cockpit] real game-events query failed", error);

    const fallbackState: GameEventsSourceState = {
      mode: "real",
      backendStatus: "real-error",
      notes:
        error instanceof Error
          ? `Real game-events query failed. Falling back to mock data. ${error.message}`
          : "Real game-events query failed. Falling back to mock data.",
      projectId: resolved.state.projectId,
      dataset: resolved.state.dataset,
    };

    const snapshot = await resolved.fallbackSource.getGameEvents(environment);
    const response = withSourceMetadata(snapshot, {
      sourceUsed: "mock",
      backendStatus: "real-error",
      backendNote: fallbackState.notes,
    });

    lastObservedState = {
      ...fallbackState,
      lastResponseStatus: response.backendStatus,
      lastSourceUsed: response.sourceUsed,
      lastBackendNote: response.backendNote,
    };

    return response;
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

function withSourceMetadata(
  snapshot: GameEventsSnapshot,
  metadata: Pick<
    GameEventsResponse,
    "sourceUsed" | "backendStatus" | "backendNote"
  >,
): GameEventsResponse {
  return {
    ...snapshot,
    ...metadata,
  };
}
