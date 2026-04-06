import { NextResponse } from "next/server";

import { authorizeCockpitRequest } from "@/lib/cockpit/auth";
import { getSummary } from "@/lib/cockpit/summary/get-summary";

export async function GET(request: Request) {
  const unauthorizedResponse = authorizeCockpitRequest(request);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  return NextResponse.json(await getSummary(), {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
