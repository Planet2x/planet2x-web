import type {
  GameEventsEnvironment,
  GameEventsSnapshot,
  GameEventsSource,
} from "@/lib/cockpit/domains/game-events/types";

const GAME = "Liquid Path";
const GENERATED_AT = "2026-04-07T19:30:00Z";

const mockSnapshots: Record<GameEventsEnvironment, GameEventsSnapshot> = {
  all: {
    generatedAt: GENERATED_AT,
    game: GAME,
    environment: "all",
    quickRead: {
      firstStep: 71,
      planet2x: 8,
      activeUsers: 11,
      latestOverview: "2026-04-06",
    },
    dailyOverview: [
      {
        date: "2026-04-06",
        activeUsers: 11,
        firstStep: 71,
        finish: 8,
        falls: 63,
      },
      {
        date: "2026-04-05",
        activeUsers: 9,
        firstStep: 64,
        finish: 7,
        falls: 57,
      },
      {
        date: "2026-04-04",
        activeUsers: 12,
        firstStep: 68,
        finish: 9,
        falls: 59,
      },
    ],
    progressionFunnel: [
      {
        step: "First Step",
        runsReached: 71,
        progress: 1,
      },
      {
        step: "Mid 2",
        runsReached: 54,
        progress: 0.761,
      },
      {
        step: "Mid 3",
        runsReached: 41,
        progress: 0.577,
      },
      {
        step: "Mid 4",
        runsReached: 33,
        progress: 0.465,
      },
      {
        step: "Mid 5",
        runsReached: 24,
        progress: 0.338,
      },
      {
        step: "Mid 6",
        runsReached: 18,
        progress: 0.254,
      },
      {
        step: "Mid 7",
        runsReached: 12,
        progress: 0.169,
      },
      {
        step: "Planet2x",
        runsReached: 8,
        progress: 0.113,
      },
    ],
  },
  xcode: {
    generatedAt: GENERATED_AT,
    game: GAME,
    environment: "xcode",
    quickRead: {
      firstStep: 18,
      planet2x: 2,
      activeUsers: 4,
      latestOverview: "2026-04-06",
    },
    dailyOverview: [
      {
        date: "2026-04-06",
        activeUsers: 4,
        firstStep: 18,
        finish: 2,
        falls: 16,
      },
      {
        date: "2026-04-05",
        activeUsers: 3,
        firstStep: 15,
        finish: 1,
        falls: 14,
      },
      {
        date: "2026-04-04",
        activeUsers: 4,
        firstStep: 17,
        finish: 2,
        falls: 15,
      },
    ],
    progressionFunnel: [
      {
        step: "First Step",
        runsReached: 18,
        progress: 1,
      },
      {
        step: "Mid 2",
        runsReached: 14,
        progress: 0.778,
      },
      {
        step: "Mid 3",
        runsReached: 11,
        progress: 0.611,
      },
      {
        step: "Mid 4",
        runsReached: 8,
        progress: 0.444,
      },
      {
        step: "Mid 5",
        runsReached: 6,
        progress: 0.333,
      },
      {
        step: "Mid 6",
        runsReached: 5,
        progress: 0.278,
      },
      {
        step: "Mid 7",
        runsReached: 3,
        progress: 0.167,
      },
      {
        step: "Planet2x",
        runsReached: 2,
        progress: 0.111,
      },
    ],
  },
  testflight: {
    generatedAt: GENERATED_AT,
    game: GAME,
    environment: "testflight",
    quickRead: {
      firstStep: 20,
      planet2x: 3,
      activeUsers: 5,
      latestOverview: "2026-04-06",
    },
    dailyOverview: [
      {
        date: "2026-04-06",
        activeUsers: 5,
        firstStep: 20,
        finish: 3,
        falls: 17,
      },
      {
        date: "2026-04-05",
        activeUsers: 4,
        firstStep: 18,
        finish: 2,
        falls: 16,
      },
      {
        date: "2026-04-04",
        activeUsers: 4,
        firstStep: 19,
        finish: 2,
        falls: 17,
      },
    ],
    progressionFunnel: [
      {
        step: "First Step",
        runsReached: 20,
        progress: 1,
      },
      {
        step: "Mid 2",
        runsReached: 16,
        progress: 0.8,
      },
      {
        step: "Mid 3",
        runsReached: 13,
        progress: 0.65,
      },
      {
        step: "Mid 4",
        runsReached: 10,
        progress: 0.5,
      },
      {
        step: "Mid 5",
        runsReached: 8,
        progress: 0.4,
      },
      {
        step: "Mid 6",
        runsReached: 6,
        progress: 0.3,
      },
      {
        step: "Mid 7",
        runsReached: 4,
        progress: 0.2,
      },
      {
        step: "Planet2x",
        runsReached: 3,
        progress: 0.15,
      },
    ],
  },
  appstore: {
    generatedAt: GENERATED_AT,
    game: GAME,
    environment: "appstore",
    quickRead: {
      firstStep: 33,
      planet2x: 3,
      activeUsers: 2,
      latestOverview: "2026-04-05",
    },
    dailyOverview: [
      {
        date: "2026-04-05",
        activeUsers: 2,
        firstStep: 28,
        finish: 0,
        falls: 28,
      },
      {
        date: "2026-04-04",
        activeUsers: 3,
        firstStep: 33,
        finish: 2,
        falls: 31,
      },
      {
        date: "2026-04-03",
        activeUsers: 2,
        firstStep: 30,
        finish: 1,
        falls: 29,
      },
    ],
    progressionFunnel: [
      {
        step: "First Step",
        runsReached: 33,
        progress: 1,
      },
      {
        step: "Mid 2",
        runsReached: 27,
        progress: 0.818,
      },
      {
        step: "Mid 3",
        runsReached: 21,
        progress: 0.636,
      },
      {
        step: "Mid 4",
        runsReached: 16,
        progress: 0.485,
      },
      {
        step: "Mid 5",
        runsReached: 12,
        progress: 0.364,
      },
      {
        step: "Mid 6",
        runsReached: 8,
        progress: 0.242,
      },
      {
        step: "Mid 7",
        runsReached: 5,
        progress: 0.152,
      },
      {
        step: "Planet2x",
        runsReached: 3,
        progress: 0.091,
      },
    ],
  },
};

export class MockGameEventsSource implements GameEventsSource {
  async getGameEvents(
    environment: GameEventsEnvironment,
  ): Promise<GameEventsSnapshot> {
    return mockSnapshots[environment];
  }
}
