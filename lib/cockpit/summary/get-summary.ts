import {
  getCockpitSummarySourceMode,
  getRealSummaryConfiguration,
} from "@/lib/cockpit/config";
import { MockSummarySource } from "@/lib/cockpit/summary/mock-summary-source";
import { RealSummarySource } from "@/lib/cockpit/summary/real-summary-source";
import type {
  SummarySource,
  SummarySourceState,
} from "@/lib/cockpit/summary/types";
import type { DashboardSummary } from "@/lib/cockpit/types";

export async function getSummary(): Promise<DashboardSummary> {
  const { source } = resolveSummarySource();
  return source.getSummary();
}

export function getSummarySourceState(): SummarySourceState {
  return resolveSummarySource().state;
}

function resolveSummarySource(): {
  source: SummarySource;
  state: SummarySourceState;
} {
  const mode = getCockpitSummarySourceMode();

  if (mode === "real") {
    const configuration = getRealSummaryConfiguration();
    const isConfigured = Boolean(
      configuration.googleCloudProjectId &&
        configuration.bigQueryDataset &&
        configuration.bigQuerySummaryView,
    );

    if (isConfigured) {
      return {
        source: new RealSummarySource(configuration),
        state: {
          mode,
          backendStatus: "real-ready",
          notes:
            "Real summary mode is selected and the expected BigQuery configuration is present. Query execution is the next implementation step.",
        },
      };
    }

    return {
      source: new MockSummarySource(),
      state: {
        mode,
        backendStatus: "real-not-configured",
        notes:
          "Real summary mode is selected, but required BigQuery configuration is incomplete. Falling back to mock summary data.",
      },
    };
  }

  return {
    source: new MockSummarySource(),
    state: {
      mode,
      backendStatus: "mock",
      notes: "Mock summary mode is active.",
    },
  };
}
