import type { DashboardSummary } from "@/lib/cockpit/types";
import type { SummarySource } from "@/lib/cockpit/summary/types";

const game = "Liquid Path";

export class MockSummarySource implements SummarySource {
  async getSummary(): Promise<DashboardSummary> {
    return {
      generatedAt: "2026-04-06T18:20:00Z",
      game,
      activeUsers: 18240,
      firstStepUsers: 13960,
      finishUsers: 5210,
      fallEvents: 24880,
    };
  }
}
