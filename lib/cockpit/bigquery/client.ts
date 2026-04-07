import { BigQuery } from "@google-cloud/bigquery";

import { getRealGameEventsConfiguration } from "@/lib/cockpit/config";

let bigQueryClient: BigQuery | null = null;

export function getBigQueryClient(): BigQuery {
  if (bigQueryClient) {
    return bigQueryClient;
  }

  const configuration = getRealGameEventsConfiguration();
  const projectId = configuration.googleCloudProjectId;

  if (!projectId) {
    throw new Error(
      "BigQuery client is not configured. Missing COCKPIT_GCP_PROJECT_ID.",
    );
  }

  bigQueryClient = new BigQuery({ projectId });
  return bigQueryClient;
}
