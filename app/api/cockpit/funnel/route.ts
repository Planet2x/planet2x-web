import { NextResponse } from "next/server";

import { authorizeCockpitRequest } from "@/lib/cockpit/auth";
import { getMockFunnel } from "@/lib/cockpit/mock-data";

export async function GET(request: Request) {
  const unauthorizedResponse = authorizeCockpitRequest(request);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  return NextResponse.json(getMockFunnel(), {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
