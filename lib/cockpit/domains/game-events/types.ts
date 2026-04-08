export const gameEventsEnvironments = [
  "all",
  "xcode",
  "testflight",
  "appstore",
] as const;

export type GameEventsEnvironment = (typeof gameEventsEnvironments)[number];

export type GameEventsQuickRead = {
  firstStep: number;
  planet2x: number;
  activeUsers: number;
  latestOverview: string;
};

export type GameEventsDailyOverviewRow = {
  date: string;
  activeUsers: number;
  firstStep: number;
  finish: number;
  falls: number;
};

export type GameEventsProgressionRow = {
  step: string;
  runsReached: number;
  progress: number;
};

export type GameEventsSnapshot = {
  generatedAt: string;
  game: string;
  environment: GameEventsEnvironment;
  quickRead: GameEventsQuickRead;
  dailyOverview: GameEventsDailyOverviewRow[];
  progressionFunnel: GameEventsProgressionRow[];
};

export type GameEventsBackendStatus =
  | "mock"
  | "real-not-configured"
  | "real-ready"
  | "real-error";

export type GameEventsResponseStatus =
  | "mock"
  | "real-success"
  | "real-not-configured"
  | "real-error";

export type GameEventsSourceUsed = "mock" | "real";

export type GameEventsResponse = GameEventsSnapshot & {
  sourceUsed: GameEventsSourceUsed;
  backendStatus: GameEventsResponseStatus;
  backendNote: string;
};

export type GameEventsSourceState = {
  mode: "mock" | "real";
  backendStatus: GameEventsBackendStatus;
  notes: string;
  projectId?: string | null;
  dataset?: string | null;
  lastResponseStatus?: GameEventsResponseStatus;
  lastSourceUsed?: GameEventsSourceUsed;
  lastBackendNote?: string;
};

export interface GameEventsSource {
  getGameEvents(
    environment: GameEventsEnvironment,
  ): Promise<GameEventsSnapshot>;
}

export function isGameEventsEnvironment(
  value: string,
): value is GameEventsEnvironment {
  return gameEventsEnvironments.includes(value as GameEventsEnvironment);
}
