const DEFAULT_TIMEOUT_MS = 15000;

export function getCockpitBearerToken(): string | null {
  const token = process.env.COCKPIT_API_BEARER_TOKEN?.trim();
  return token ? token : null;
}

export function getCockpitRequestTimeoutMs(): number {
  const rawValue = process.env.COCKPIT_API_TIMEOUT_MS?.trim();
  const parsed = rawValue ? Number(rawValue) : Number.NaN;

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_TIMEOUT_MS;
  }

  return parsed;
}
