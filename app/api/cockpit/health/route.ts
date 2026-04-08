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
      summaryLastResponseStatus: summaryState.lastResponseStatus ?? null,
      summaryLastSourceUsed: summaryState.lastSourceUsed ?? null,
      summaryLastBackendNote: summaryState.lastBackendNote ?? null,
      summaryProjectId: summaryState.projectId ?? null,
      summaryDataset: summaryState.dataset ?? null,
      summaryNotes: summaryState.notes,
      gameEventsSourceMode: gameEventsState.mode,
      gameEventsBackendStatus: gameEventsState.backendStatus,
      gameEventsLastResponseStatus:
        gameEventsState.lastResponseStatus ?? null,
      gameEventsLastSourceUsed: gameEventsState.lastSourceUsed ?? null,
      gameEventsLastBackendNote: gameEventsState.lastBackendNote ?? null,
      gameEventsProjectId: gameEventsState.projectId ?? null,
      gameEventsDataset: gameEventsState.dataset ?? null,
      gameEventsNotes: gameEventsState.notes,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
