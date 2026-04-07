import { NextResponse } from "next/server";

import { authorizeCockpitRequest } from "@/lib/cockpit/auth";
import { getGameEvents } from "@/lib/cockpit/domains/game-events/get-game-events";
import {
  isGameEventsEnvironment,
  type GameEventsEnvironment,
} from "@/lib/cockpit/domains/game-events/types";

export async function GET(request: Request) {
  const unauthorizedResponse = authorizeCockpitRequest(request);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const url = new URL(request.url);
  const environmentParam =
    url.searchParams.get("environment")?.trim().toLowerCase() ?? "all";

  if (!isGameEventsEnvironment(environmentParam)) {
    return NextResponse.json(
      {
        error:
          "Invalid environment query parameter. Expected one of: all, xcode, testflight, appstore.",
      },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  return NextResponse.json(
    await getGameEvents(environmentParam as GameEventsEnvironment),
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
