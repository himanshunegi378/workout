import { HttpResponse } from "msw";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExerciseFixture {
    id: string;
    name: string;
    description: string | null;
    muscle_group: string;
    user_id: string;
    created_at: string;
}

// ─── Fixture Data ─────────────────────────────────────────────────────────────

export const exerciseFixtures: ExerciseFixture[] = [
    {
        id: "ex-1",
        name: "Bench Press",
        description: "Flat barbell bench press",
        muscle_group: "Chest",
        user_id: "test-user",
        created_at: "2026-01-01T00:00:00.000Z",
    },
    {
        id: "ex-2",
        name: "Barbell Squat",
        description: "Back squat with barbell",
        muscle_group: "Legs",
        user_id: "test-user",
        created_at: "2026-01-01T00:00:00.000Z",
    },
    {
        id: "ex-3",
        name: "Pull Up",
        description: "Bodyweight pull-up",
        muscle_group: "Back",
        user_id: "test-user",
        created_at: "2026-01-01T00:00:00.000Z",
    },
];

// ─── Resolvers ────────────────────────────────────────────────────────────────

/**
 * Named response factories for /api/exercises.
 *
 * Usage in handlers.ts:
 *   http.get("/api/exercises", exercise.success())
 *
 * Usage in per-test overrides:
 *   server.use(http.get("/api/exercises", exercise.error()))
 *   server.use(http.get("/api/exercises", exercise.success([customFixture])))
 */
export const exercise = {
    /** 200 — returns the default fixture list (or a custom one). */
    success: (data: ExerciseFixture[] = exerciseFixtures) =>
        () => HttpResponse.json(data),

    /** 200 — returns an empty array. */
    empty: () =>
        () => HttpResponse.json([]),

    /** 500 — simulates a server error. */
    error: (status = 500, message = "Internal Server Error") =>
        () => HttpResponse.json({ error: message }, { status }),

    /** 401 — simulates an unauthenticated request. */
    unauthorized: () =>
        () => HttpResponse.json({ error: "Unauthorized" }, { status: 401 }),
};
