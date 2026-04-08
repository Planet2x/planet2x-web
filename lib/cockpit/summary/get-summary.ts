import {
  getCockpitSummarySourceMode,
  getRealSummaryConfiguration,
} from "@/lib/cockpit/config";
import type { GameEventsEnvironment } from "@/lib/cockpit/domains/game-events/types";
import { MockSummarySource } from "@/lib/cockpit/summary/mock-summary-source";
import { RealSummarySource } from "@/lib/cockpit/summary/real-summary-source";
import type {
  DashboardSummaryResponse,
  SummarySource,
  SummarySourceState,
} from "@/lib/cockpit/summary/types";
import type { DashboardSummary } from "@/lib/cockpit/types";

let lastObservedState: SummarySourceState | null = null;

export async function getSummary(
  environment: GameEventsEnvironment,
): Promise<DashboardSummaryResponse> {
  const resolved = resolveSummarySource();

  if (resolved.state.backendStatus === "mock") {
    const summary = await resolved.source.getSummary(environment);
    const response = withSourceMetadata(summary, {
      sourceUsed: "mock",
      backendStatus: "mock",
      backendNote: "Mock summary mode is active.",
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
    const summary = await resolved.fallbackSource.getSummary(environment);
    const response = withSourceMetadata(summary, {
      sourceUsed: "mock",
      backendStatus: "real-not-configured",
      backendNote:
        "Real summary mode is selected, but BigQuery configuration is incomplete. Serving mock fallback data.",
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
    const summary = await resolved.source.getSummary(environment);
    const response = withSourceMetadata(summary, {
      sourceUsed: "real",
      backendStatus: "real-success",
      backendNote: "Real BigQuery summary data returned successfully.",
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
    console.error("[cockpit] real summary query failed", error);

    const fallbackState: SummarySourceState = {
      mode: "real",
      backendStatus: "real-error",
      notes:
        error instanceof Error
          ? `Real summary query failed. Falling back to mock data. ${error.message}`
          : "Real summary query failed. Falling back to mock data.",
      projectId: resolved.state.projectId,
      dataset: resolved.state.dataset,
    };

    const summary = await resolved.fallbackSource.getSummary(environment);
    const response = withSourceMetadata(summary, {
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

export function getSummarySourceState(): SummarySourceState {
  return lastObservedState ?? resolveSummarySource().state;
}

function resolveSummarySource(): {
  source: SummarySource;
  fallbackSource: SummarySource;
  state: SummarySourceState;
} {
  const mode = getCockpitSummarySourceMode();
  const mockSource = new MockSummarySource();

  if (mode === "real") {
    const configuration = getRealSummaryConfiguration();
    const isConfigured = Boolean(
      configuration.googleCloudProjectId &&
        configuration.bigQueryDataset &&
        configuration.bigQuerySummaryView &&
        configuration.googleApplicationCredentials,
    );

    if (isConfigured) {
      return {
        source: new RealSummarySource(configuration),
        fallbackSource: mockSource,
        state: {
          mode,
          backendStatus: "real-ready",
          notes:
            "Real summary mode is selected and BigQuery configuration is present.",
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
          "Real summary mode is selected, but required BigQuery configuration is incomplete. Falling back to mock summary data.",
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
      notes: "Mock summary mode is active.",
      projectId: null,
      dataset: null,
    },
  };
}

function withSourceMetadata(
  summary: DashboardSummary,
  metadata: Pick<
    DashboardSummaryResponse,
    "sourceUsed" | "backendStatus" | "backendNote"
  >,
): DashboardSummaryResponse {
  return {
    ...summary,
    ...metadata,
  };
}
