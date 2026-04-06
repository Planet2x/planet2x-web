import { NextResponse } from "next/server";

import { authorizeCockpitRequest } from "@/lib/cockpit/auth";
import { getMockHealth } from "@/lib/cockpit/mock-data";
import { getSummarySourceState } from "@/lib/cockpit/summary/get-summary";

export async function GET(request: Request) {
  const unauthorizedResponse = authorizeCockpitRequest(request);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const health = getMockHealth();
  const summaryState = getSummarySourceState();

  return NextResponse.json(
    {
      ...health,
      summarySourceMode: summaryState.mode,
      summaryBackendStatus: summaryState.backendStatus,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
