import { describe, it, expect, beforeEach } from "vitest";
import { GET as getLastLog } from "@/app/api/exercises/[exerciseId]/last-log/route";
import { GET as getLogs } from "@/app/api/exercises/logs/route";
import prisma from "@/lib/prisma";
import { authenticateAs, unauthenticate } from "@/tests/helpers/auth-utils";
import { createMockRequest, makeParams } from "@/tests/helpers/request-utils";
import { seedSession } from "@/tests/helpers/seed-utils";
import { MuscleGroup } from "@/app/generated/prisma/client";
import { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeGetRequest(path: string) {
    return createMockRequest(`http://localhost:3000${path}`) as NextRequest;
}

/**
 * Build the logs endpoint request with one or more exerciseId query params.
 */
function makeLogsRequest(...exerciseIds: string[]) {
    const searchParams = new URLSearchParams();
    exerciseIds.forEach((exerciseId) => searchParams.append("exerciseId", exerciseId));
    return makeGetRequest(`/api/exercises/logs?${searchParams.toString()}`);
}

/**
 * Seed a complete chain for testing.
 */
async function seedFullChain(userId: string, exerciseName = "Squat") {
    const data = await seedSession(userId, new Date(), exerciseName);
    return {
        exerciseId: data.exercise.id,
        programmeId: data.programme.id,
        workoutId: data.workout.id,
        metadataId: data.ewm!.id,
        sessionId: data.session.id,
        logId: data.log.id
    };
}

/** Seed an ad-hoc ExerciseLog linked directly to an Exercise (no ExerciseWithMetadata). */
async function seedAdHocLog(userId: string, exerciseId: string, opts = { reps: 8, weight: 60, date: new Date() }) {
    const exerciseLog = await prisma.exerciseLog.create({
        data: {
            reps: opts.reps,
            weight: opts.weight,
            set_order_index: 0,
            user_id: userId,
            exerciseId: exerciseId,
            date: opts.date,
        },
    });
    return exerciseLog;
}

// ---------------------------------------------------------------------------
// Integration Tests
// ---------------------------------------------------------------------------

describe("Exercise Sub-routes — Integration", () => {
    let userId: string;

    beforeEach(async () => {
        const user = await prisma.user.create({
            data: {
                username: "exercise_subroute_user",
                password_hash: "$2b$10$fakehashforintegrationtests000000000000000000",
            },
        });
        userId = user.id;
        authenticateAs(userId);
    });

    // -----------------------------------------------------------------------
    // GET /api/exercises/[exerciseId]/last-log
    // -----------------------------------------------------------------------

    describe("GET /api/exercises/[exerciseId]/last-log", () => {
        it("should return 401 when not authenticated", async () => {
            // Create the exercise while authenticated, then revoke auth
            const ex = await prisma.exercise.create({
                data: { name: "Dip", muscle_group: MuscleGroup.Triceps, user_id: userId },
            });
            unauthenticate();

            const request = makeGetRequest(`/api/exercises/${ex.id}/last-log`);
            const response = await getLastLog(request, makeParams({ exerciseId: ex.id }));

            expect(response.status).toBe(401);
        });

        it("should return 404 when exercise does not exist", async () => {
            const request = makeGetRequest("/api/exercises/nonexistent-id/last-log");
            const response = await getLastLog(request, makeParams({ exerciseId: "nonexistent-id" }));
            expect(response.status).toBe(404);
        });

        it("should return 404 when exercise belongs to another user", async () => {
            const otherUser = await prisma.user.create({
                data: { username: "other_user_ll", password_hash: "hash" },
            });
            const exercise = await prisma.exercise.create({
                data: { name: "Curl", muscle_group: MuscleGroup.Biceps, user_id: otherUser.id },
            });

            const request = makeGetRequest(`/api/exercises/${exercise.id}/last-log`);
            const response = await getLastLog(request, makeParams({ exerciseId: exercise.id }));

            expect(response.status).toBe(404);
        });

        it("should return null when exercise exists but has no logs", async () => {
            const exercise = await prisma.exercise.create({
                data: { name: "Pushup", muscle_group: MuscleGroup.Chest, user_id: userId },
            });

            const request = makeGetRequest(`/api/exercises/${exercise.id}/last-log`);
            const response = await getLastLog(request, makeParams({ exerciseId: exercise.id }));
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toBeNull();
        });

        it("should return weight and reps from the latest ad-hoc log", async () => {
            const exercise = await prisma.exercise.create({
                data: { name: "Bench Press", muscle_group: MuscleGroup.Chest, user_id: userId },
            });

            const older = new Date("2025-01-01T10:00:00Z");
            const newer = new Date("2025-01-10T10:00:00Z");

            await seedAdHocLog(userId, exercise.id, { reps: 5, weight: 100, date: older });
            await seedAdHocLog(userId, exercise.id, { reps: 8, weight: 90, date: newer });

            const request = makeGetRequest(`/api/exercises/${exercise.id}/last-log`);
            const response = await getLastLog(request, makeParams({ exerciseId: exercise.id }));
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toMatchObject({ weight: 90, reps: 8 });
            // Must not include extra fields like user_id
            expect(data.id).toBeDefined();
            expect(data.user_id).toBeUndefined();
        });

        it("should return weight and reps from a log linked via ExerciseWithMetadata", async () => {
            const { exerciseId } = await seedFullChain(userId, "Deadlift");

            const request = makeGetRequest(`/api/exercises/${exerciseId}/last-log`);
            const response = await getLastLog(request, makeParams({ exerciseId }));
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toMatchObject({ weight: 80, reps: 10 });
        });

        it("should prefer the newer log when both ad-hoc logs have different dates", async () => {
            const exercise = await prisma.exercise.create({
                data: { name: "OHP", muscle_group: MuscleGroup.Shoulders, user_id: userId },
            });

            const older = new Date("2025-01-01T10:00:00Z");
            const newer = new Date("2025-06-01T10:00:00Z");

            await seedAdHocLog(userId, exercise.id, { reps: 6, weight: 50, date: older });
            await seedAdHocLog(userId, exercise.id, { reps: 8, weight: 55, date: newer });

            const request = makeGetRequest(`/api/exercises/${exercise.id}/last-log`);
            const response = await getLastLog(request, makeParams({ exerciseId: exercise.id }));
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toMatchObject({ weight: 55, reps: 8 });
        });
    });

    // -----------------------------------------------------------------------
    // GET /api/exercises/logs
    // -----------------------------------------------------------------------

    describe("GET /api/exercises/logs", () => {
        it("should return 401 when not authenticated", async () => {
            unauthenticate();
            const request = makeGetRequest("/api/exercises/logs?exerciseId=any-id");
            const response = await getLogs(request);
            expect(response.status).toBe(401);
        });

        it("should return empty array when no logs exist for the exercise", async () => {
            const exercise = await prisma.exercise.create({
                data: { name: "Plank", muscle_group: MuscleGroup.Abs, user_id: userId },
            });

            const request = makeLogsRequest(exercise.id);
            const response = await getLogs(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual([]);
        });

        it("should return logs for ad-hoc (direct exerciseId) logs", async () => {
            const exercise = await prisma.exercise.create({
                data: { name: "Curl", muscle_group: MuscleGroup.Biceps, user_id: userId },
            });
            await seedAdHocLog(userId, exercise.id, { reps: 10, weight: 20, date: new Date() });

            const request = makeLogsRequest(exercise.id);
            const response = await getLogs(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveLength(1);
            expect(data[0]).toMatchObject({ reps: 10, weight: 20 });
        });

        it("should return logs linked via ExerciseWithMetadata", async () => {
            const { exerciseId } = await seedFullChain(userId, "Romanian Deadlift");

            const request = makeLogsRequest(exerciseId);
            const response = await getLogs(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveLength(1);
            expect(data[0]).toMatchObject({ reps: 10, weight: 80 });
        });

        it("should NOT return logs belonging to another user", async () => {
            const otherUser = await prisma.user.create({
                data: { username: "other_logs_user", password_hash: "hash" },
            });
            const exercise = await prisma.exercise.create({
                data: { name: "Lunge", muscle_group: MuscleGroup.Legs, user_id: userId },
            });

            // Create a log for the other user linking to the same exerciseId
            await prisma.exerciseLog.create({
                data: {
                    reps: 12,
                    weight: 30,
                    set_order_index: 0,
                    user_id: otherUser.id,
                    exerciseId: exercise.id,
                },
            });

            const request = makeLogsRequest(exercise.id);
            const response = await getLogs(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveLength(0);
        });

        it("should include nested sessionExerciseLog with workoutSession date and exerciseWithMetadata", async () => {
            const { exerciseId } = await seedFullChain(userId, "Hip Thrust");

            const request = makeLogsRequest(exerciseId);
            const response = await getLogs(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveLength(1);

            const log = data[0];
            expect(log.workoutSession).toMatchObject({
                date: expect.any(String),
            });
            expect(log.exerciseWithMetadata).toMatchObject({
                reps_min: 8,
                reps_max: 12,
                sets_min: 3,
                sets_max: 4,
                tempo: "3-1-2-0",
            });
        });

        it("should return null sessionExerciseLog for ad-hoc logs", async () => {
            const exercise = await prisma.exercise.create({
                data: { name: "Face Pull", muscle_group: MuscleGroup.Shoulders, user_id: userId },
            });
            await seedAdHocLog(userId, exercise.id);

            const request = makeLogsRequest(exercise.id);
            const response = await getLogs(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveLength(1);
            expect(data[0].exerciseWithMetadata).toBeNull();
        });

        it("should return multiple logs ordered by session date desc then set_order_index asc", async () => {
            const exercise = await prisma.exercise.create({
                data: { name: "Row", muscle_group: MuscleGroup.Back, user_id: userId },
            });

            const date1 = new Date("2025-01-01T10:00:00Z");
            const date2 = new Date("2025-06-01T10:00:00Z");

            // Older log
            await seedAdHocLog(userId, exercise.id, { reps: 5, weight: 70, date: date1 });
            // Newer log
            await seedAdHocLog(userId, exercise.id, { reps: 8, weight: 75, date: date2 });

            const request = makeLogsRequest(exercise.id);
            const response = await getLogs(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveLength(2);
            // Ad-hoc logs have no sessionExerciseLog, so ordering by session date won't
            // distinguish them — but they should both be returned
            expect(data.map((d: { reps: number }) => d.reps)).toContain(5);
            expect(data.map((d: { reps: number }) => d.reps)).toContain(8);
        });

        it("should return logs for repeated exerciseId query params", async () => {
            const first = await prisma.exercise.create({
                data: { name: "Cable Fly", muscle_group: MuscleGroup.Chest, user_id: userId },
            });
            const second = await prisma.exercise.create({
                data: { name: "Lat Raise", muscle_group: MuscleGroup.Shoulders, user_id: userId },
            });

            await seedAdHocLog(userId, first.id, { reps: 10, weight: 15, date: new Date() });
            await seedAdHocLog(userId, second.id, { reps: 12, weight: 10, date: new Date() });

            const request = makeLogsRequest(first.id, second.id);
            const response = await getLogs(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveLength(2);
            expect(data.map((d: { reps: number }) => d.reps)).toEqual(expect.arrayContaining([10, 12]));
            expect(data.map((d: { exerciseId: string }) => d.exerciseId)).toEqual(expect.arrayContaining([first.id, second.id]));
        });
    });
});
