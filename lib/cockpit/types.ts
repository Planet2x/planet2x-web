export type DashboardSummary = {
  generatedAt: string;
  game: string;
  activeUsers: number;
  firstStepUsers: number;
  finishUsers: number;
  fallEvents: number;
};

export type FunnelStep = {
  step: string;
  users: number;
  conversionFromFirstStep: number;
};

export type FunnelSnapshot = {
  generatedAt: string;
  game: string;
  steps: FunnelStep[];
};

export type HealthStatus = {
  generatedAt: string;
  apiStatus: string;
  dataSource: string;
  notes: string;
  summarySourceMode?: "mock" | "real";
  summaryBackendStatus?: string;
  gameEventsSourceMode?: "mock" | "real";
  gameEventsBackendStatus?: string;
  gameEventsProjectId?: string | null;
  gameEventsDataset?: string | null;
};
