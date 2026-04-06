import { NextResponse } from "next/server";

import { getCockpitBearerToken } from "@/lib/cockpit/config";

export function authorizeCockpitRequest(request: Request): NextResponse | null {
  const expectedToken = getCockpitBearerToken();

  if (!expectedToken) {
    return NextResponse.json(
      {
        error: "cockpit_api_token_missing",
        message: "COCKPIT_API_BEARER_TOKEN is not configured on the server.",
      },
      { status: 500 },
    );
  }

  const header = request.headers.get("authorization");

  if (!header?.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        error: "unauthorized",
        message: "Missing bearer token.",
      },
      { status: 401 },
    );
  }

  const providedToken = header.slice("Bearer ".length).trim();

  if (providedToken !== expectedToken) {
    return NextResponse.json(
      {
        error: "unauthorized",
        message: "Invalid bearer token.",
      },
      { status: 401 },
    );
  }

  return null;
}
