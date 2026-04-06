import type { FunnelSnapshot, HealthStatus } from "@/lib/cockpit/types";
import { getSummarySourceState } from "@/lib/cockpit/summary/get-summary";

const game = "Liquid Path";

export function getMockFunnel(): FunnelSnapshot {
  return {
    generatedAt: "2026-04-06T18:20:00Z",
    game,
    steps: [
      {
        step: "Install",
        users: 13960,
        conversionFromFirstStep: 1,
      },
      {
        step: "Tutorial Start",
        users: 12410,
        conversionFromFirstStep: 0.889,
      },
      {
        step: "Tutorial Complete",
        users: 9830,
        conversionFromFirstStep: 0.704,
      },
      {
        step: "Run Start",
        users: 7340,
        conversionFromFirstStep: 0.526,
      },
      {
        step: "First Finish",
        users: 5210,
        conversionFromFirstStep: 0.373,
      },
    ],
  };
}

export function getMockHealth(): HealthStatus {
  const summaryState = getSummarySourceState();

  return {
    generatedAt: "2026-04-06T18:20:00Z",
    apiStatus: "Mock Static Mode",
    dataSource: "Local server mock data",
    notes:
      `Summary source mode: ${summaryState.mode}. Summary backend status: ${summaryState.backendStatus}. ${summaryState.notes}`,
  };
}
