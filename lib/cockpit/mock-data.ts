import type {
  DashboardSummary,
  FunnelSnapshot,
  HealthStatus,
} from "@/lib/cockpit/types";

const game = "Liquid Path";

export function getMockSummary(): DashboardSummary {
  return {
    generatedAt: "2026-04-06T18:20:00Z",
    game,
    activeUsers: 18240,
    firstStepUsers: 13960,
    finishUsers: 5210,
    fallEvents: 24880,
  };
}

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
  return {
    generatedAt: "2026-04-06T18:20:00Z",
    apiStatus: "Mock Static Mode",
    dataSource: "Local server mock data",
    notes:
      "Protected cockpit endpoints are live in scaffold form. Replace mock data with real BigQuery-backed summaries in the next backend phase.",
  };
}
