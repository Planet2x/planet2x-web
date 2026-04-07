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

export async function getGameEvents(
  environment: GameEventsEnvironment,
): Promise<GameEventsSnapshot> {
  const { source } = resolveGameEventsSource();
  return source.getGameEvents(environment);
}

export function getGameEventsSourceState(): GameEventsSourceState {
  return resolveGameEventsSource().state;
}

function resolveGameEventsSource(): {
  source: GameEventsSource;
  state: GameEventsSourceState;
} {
  const mode = getCockpitGameEventsSourceMode();
  const mockSource = new MockGameEventsSource();

  if (mode === "real") {
    const configuration = getRealGameEventsConfiguration();
    const isConfigured = Boolean(
      configuration.googleCloudProjectId &&
        configuration.bigQueryDataset &&
        configuration.bigQueryGameEventsView,
    );

    if (isConfigured) {
      return {
        source: new RealGameEventsSource(configuration, mockSource),
        state: {
          mode,
          backendStatus: "real-ready",
          notes:
            "Real game-events mode is selected and the expected BigQuery configuration is present. Mock fallback remains active until query execution is implemented.",
        },
      };
    }

    return {
      source: mockSource,
      state: {
        mode,
        backendStatus: "real-not-configured",
        notes:
          "Real game-events mode is selected, but required BigQuery configuration is incomplete. Falling back to mock game-events data.",
      },
    };
  }

  return {
    source: mockSource,
    state: {
      mode,
      backendStatus: "mock",
      notes: "Mock game-events mode is active.",
    },
  };
}
