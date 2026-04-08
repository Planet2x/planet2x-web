import type { DashboardSummary } from "@/lib/cockpit/types";
import type { CockpitSummarySourceMode } from "@/lib/cockpit/config";
import type { GameEventsEnvironment } from "@/lib/cockpit/domains/game-events/types";

export type SummaryBackendStatus =
  | "mock"
  | "real-not-configured"
  | "real-ready"
  | "real-error";

export type SummaryResponseStatus =
  | "mock"
  | "real-success"
  | "real-not-configured"
  | "real-error";

export type SummarySourceUsed = "mock" | "real";

export type DashboardSummaryResponse = DashboardSummary & {
  sourceUsed: SummarySourceUsed;
  backendStatus: SummaryResponseStatus;
  backendNote: string;
};

export type SummarySourceState = {
  mode: CockpitSummarySourceMode;
  backendStatus: SummaryBackendStatus;
  notes: string;
  projectId?: string | null;
  dataset?: string | null;
  lastResponseStatus?: SummaryResponseStatus;
  lastSourceUsed?: SummarySourceUsed;
  lastBackendNote?: string;
};

export type SummarySource = {
  getSummary(environment: GameEventsEnvironment): Promise<DashboardSummary>;
};
