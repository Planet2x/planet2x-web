import { NextResponse } from "next/server";

import { authorizeCockpitRequest } from "@/lib/cockpit/auth";
import { getGameEventsSourceState } from "@/lib/cockpit/domains/game-events/get-game-events";
import { getMockHealth } from "@/lib/cockpit/mock-data";
import { getSummarySourceState } from "@/lib/cockpit/summary/get-summary";

export async function GET(request: Request) {
  const unauthorizedResponse = authorizeCockpitRequest(request);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const health = getMockHealth();
  const summaryState = getSummarySourceState();
  const gameEventsState = getGameEventsSourceState();

  return NextResponse.json(
    {
      ...health,
      summarySourceMode: summaryState.mode,
      summaryBackendStatus: summaryState.backendStatus,
      gameEventsSourceMode: gameEventsState.mode,
      gameEventsBackendStatus: gameEventsState.backendStatus,
      gameEventsProjectId: gameEventsState.projectId ?? null,
      gameEventsDataset: gameEventsState.dataset ?? null,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
