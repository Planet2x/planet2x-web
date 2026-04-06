import type { DashboardSummary } from "@/lib/cockpit/types";
import type { CockpitSummarySourceMode } from "@/lib/cockpit/config";

export type SummaryBackendStatus =
  | "mock"
  | "real-not-configured"
  | "real-ready";

export type SummarySourceState = {
  mode: CockpitSummarySourceMode;
  backendStatus: SummaryBackendStatus;
  notes: string;
};

export type SummarySource = {
  getSummary(): Promise<DashboardSummary>;
};
