import type { DashboardSummary } from "@/lib/cockpit/types";
import type { RealSummaryConfiguration } from "@/lib/cockpit/config";
import type { SummarySource } from "@/lib/cockpit/summary/types";

export class RealSummarySource implements SummarySource {
  constructor(private readonly configuration: RealSummaryConfiguration) {}

  async getSummary(): Promise<DashboardSummary> {
    const missingConfiguration = [
      !this.configuration.googleCloudProjectId && "GOOGLE_CLOUD_PROJECT_ID",
      !this.configuration.bigQueryDataset && "BIGQUERY_DATASET",
      !this.configuration.bigQuerySummaryView && "BIGQUERY_SUMMARY_VIEW",
    ].filter(Boolean);

    if (missingConfiguration.length > 0) {
      throw new Error(
        `Real summary source is not configured. Missing: ${missingConfiguration.join(", ")}`,
      );
    }

    // BigQuery-backed integration will be added here in the next backend step.
    // Keep SQL and transport details inside this module rather than the route layer.
    throw new Error("Real summary source is not implemented yet.");
  }
}
