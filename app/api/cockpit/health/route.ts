import { NextResponse } from "next/server";

import { authorizeCockpitRequest } from "@/lib/cockpit/auth";
import { getMockHealth } from "@/lib/cockpit/mock-data";

export async function GET(request: Request) {
  const unauthorizedResponse = authorizeCockpitRequest(request);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  return NextResponse.json(getMockHealth(), {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
