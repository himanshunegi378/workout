export const queryKeys = {
    dashboard: {
        all: ["dashboard"] as const,
        fatigue: ["dashboard", "fatigue"] as const,
    },
    workouts: {
        all: () => ["workouts"] as const,
    },
    analytics: {
        all: () => ["analytics"] as const,
        sessionVolume: (workoutId: string, limit: number) =>
            [...queryKeys.analytics.all(), "session-volume", workoutId, limit] as const,
    }
};

// Aliases for backwards compatibility with older hooks
export const dashboardKeys = queryKeys.dashboard;
