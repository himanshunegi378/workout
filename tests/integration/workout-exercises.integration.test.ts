import { describe, it, expect, beforeEach } from "vitest";
import { GET as getDetails } from "@/app/api/programmes/[programmeId]/workouts/[workoutId]/details/route";
import { POST as addExercise } from "@/app/api/programmes/[programmeId]/workouts/[workoutId]/exercises/route";
import { PATCH as patchMetadata } from "@/app/api/programmes/[programmeId]/workouts/[workoutId]/exercises/[metadataId]/route";
import { GET as getWorkouts } from "@/app/api/workouts/route";
import prisma from "@/lib/prisma";
import { authenticateAs, unauthenticate } from "@/tests/helpers/auth-utils";
import { createMockRequest, jsonReq, makeParams } from "@/tests/helpers/request-utils";
import { seedUser } from "@/tests/helpers/seed-utils";
import { NextRequest } from "next/server";
import { MuscleGroup } from "@/app/generated/prisma/client";

const EWM_DEFAULTS = {
    reps_min: 8, reps_max: 12,
    sets_min: 3, sets_max: 4,
    rest_min: 60, rest_max: 90,
    tempo: "3-1-2-0", order_index: 0,
};

/** Seed the full programme → workout → exercise → EWM chain. */
async function seedProgramChain(userId: string) {
    const programme = await prisma.programme.create({ data: { name: "Prog", user_id: userId } });
    const workout = await prisma.workout.create({
        data: { name: "Day A", order_index: 0, programme_id: programme.id },
    });
    const exercise = await prisma.exercise.create({
        data: { name: "Bench", muscle_group: MuscleGroup.Chest, user_id: userId },
    });
    const ewm = await prisma.exerciseWithMetadata.create({
        data: { exercise_id: exercise.id, workout_id: workout.id, ...EWM_DEFAULTS },
    });
    return { programme, workout, exercise, ewm };
}

// ---------------------------------------------------------------------------
// GET /api/programmes/[programmeId]/workouts/[workoutId]/details
// ---------------------------------------------------------------------------

describe("GET workout details — Integration", () => {
    let userId: string;

    beforeEach(async () => {
        const user = await seedUser({ username: "details_user", password_hash: "hash" });
        userId = user.id;
        authenticateAs(userId);
    });

    it("should return 401 when not authenticated", async () => {
        unauthenticate();
        const req = createMockRequest("http://localhost:3000/any") as NextRequest;
        expect((await getDetails(req, makeParams({ programmeId: "x", workoutId: "y" }))).status).toBe(401);
    });

    it("should return 404 when workout not found", async () => {
        const req = createMockRequest("http://localhost:3000/api") as NextRequest;
        expect((await getDetails(req, makeParams({ programmeId: "ghost", workoutId: "ghost" }))).status).toBe(404);
    });

    it("should return workout data with exercises and no active session", async () => {
        const { programme, workout } = await seedProgramChain(userId);
        const req = createMockRequest(`http://localhost:3000/api/programmes/${programme.id}/workouts/${workout.id}/details`) as NextRequest;
        const response = await getDetails(req, makeParams({ programmeId: programme.id, workoutId: workout.id }));
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.workout.name).toBe("Day A");
        expect(data.workout.exercisesWithMetadata).toHaveLength(1);
        expect(data.session).toBeNull();
        expect(data.previousLogsByExercise).toEqual({});
    });

    it("should include an active session if one exists today", async () => {
        const { programme, workout } = await seedProgramChain(userId);

        const session = await prisma.workoutSession.create({
            data: { user_id: userId, workout_id: workout.id, date: new Date() },
        });

        const req = createMockRequest(`http://localhost:3000/api`) as NextRequest;
        const response = await getDetails(req, makeParams({ programmeId: programme.id, workoutId: workout.id }));
        const data = await response.json();

        expect(data.session).not.toBeNull();
        expect(data.session.id).toBe(session.id);
    });
});

// ---------------------------------------------------------------------------
// POST /api/programmes/[programmeId]/workouts/[workoutId]/exercises
// ---------------------------------------------------------------------------

describe("POST exercise to workout — Integration", () => {
    let userId: string;

    beforeEach(async () => {
        const user = await seedUser({ username: "addex_user", password_hash: "hash" });
        userId = user.id;
        authenticateAs(userId);
    });

    it("should return 401 when not authenticated", async () => {
        unauthenticate();
        const req = jsonReq("http://localhost:3000/api", "POST", { exercise_id: "x" });
        expect((await addExercise(req, makeParams({ programmeId: "x", workoutId: "y" }))).status).toBe(401);
    });

    it("should return 404 when workout not found", async () => {
        const req = jsonReq("http://localhost:3000/api", "POST", { exercise_id: "x" });
        expect((await addExercise(req, makeParams({ programmeId: "ghost", workoutId: "ghost" }))).status).toBe(404);
    });

    it("should return 400 when exercise_id is missing", async () => {
        const { programme, workout } = await seedProgramChain(userId);
        const req = jsonReq("http://localhost:3000/api", "POST", { reps_min: 8 });
        expect((await addExercise(req, makeParams({ programmeId: programme.id, workoutId: workout.id }))).status).toBe(400);
    });

    it("should add an exercise to workout with auto order_index and return 201", async () => {
        const { programme, workout, exercise } = await seedProgramChain(userId);
        // One EWM already exists → next should be order_index 1
        const newEx = await prisma.exercise.create({
            data: { name: "Row", muscle_group: MuscleGroup.Back, user_id: userId },
        });
        const req = jsonReq("http://localhost:3000/api", "POST", {
            exercise_id: newEx.id, ...EWM_DEFAULTS,
        });
        const response = await addExercise(req, makeParams({ programmeId: programme.id, workoutId: workout.id }));
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.order_index).toBe(1); // 2nd exercise
        expect(data.exercise_id).toBe(newEx.id);
    });
});

// ---------------------------------------------------------------------------
// PATCH /api/programmes/[programmeId]/workouts/[workoutId]/exercises/[metadataId]
// ---------------------------------------------------------------------------

describe("PATCH exercise metadata — Integration", () => {
    let userId: string;

    beforeEach(async () => {
        const user = await seedUser({ username: "patch_meta_user", password_hash: "hash" });
        userId = user.id;
        authenticateAs(userId);
    });

    it("should return 401 when not authenticated", async () => {
        unauthenticate();
        const req = jsonReq("http://localhost:3000/api", "PATCH", { reps_min: 6 });
        expect((await patchMetadata(req, makeParams({ programmeId: "a", workoutId: "b", metadataId: "c" }))).status).toBe(401);
    });

    it("should return 404 when metadata does not exist", async () => {
        const { programme, workout } = await seedProgramChain(userId);
        const req = jsonReq("http://localhost:3000/api", "PATCH", { reps_min: 6 });
        expect((await patchMetadata(req, makeParams({ programmeId: programme.id, workoutId: workout.id, metadataId: "ghost" }))).status).toBe(404);
    });

    it("should update metadata in place when no session exists", async () => {
        const { programme, workout, ewm } = await seedProgramChain(userId);
        const req = jsonReq("http://localhost:3000/api", "PATCH", { reps_min: 6, reps_max: 10 });
        const response = await patchMetadata(req, makeParams({ programmeId: programme.id, workoutId: workout.id, metadataId: ewm.id }));
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.reps_min).toBe(6);
        expect(data.reps_max).toBe(10);

        // Old EWM should be updated in place
        const updated = await prisma.exerciseWithMetadata.findUnique({ where: { id: ewm.id } });
        expect(updated!.reps_min).toBe(6);
        expect(updated!.is_hidden).toBe(false);
    });

    it("should create new EWM and hide old one when a session exists (preserves history)", async () => {
        const { programme, workout, ewm } = await seedProgramChain(userId);

        // Create a session to trigger the history-preserving path
        await prisma.workoutSession.create({
            data: { user_id: userId, workout_id: workout.id, date: new Date() },
        });

        const req = jsonReq("http://localhost:3000/api", "PATCH", { reps_min: 4 });
        const response = await patchMetadata(req, makeParams({ programmeId: programme.id, workoutId: workout.id, metadataId: ewm.id }));
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.reps_min).toBe(4);
        expect(data.id).not.toBe(ewm.id); // new EWM created

        // Old EWM should now be hidden
        const old = await prisma.exerciseWithMetadata.findUnique({ where: { id: ewm.id } });
        expect(old!.is_hidden).toBe(true);
    });
});

// ---------------------------------------------------------------------------
// GET /api/workouts
// ---------------------------------------------------------------------------

describe("GET /api/workouts — Integration", () => {
    let userId: string;

    beforeEach(async () => {
        const user = await seedUser({ username: "workouts_list_user", password_hash: "hash" });
        userId = user.id;
        authenticateAs(userId);
    });

    it("should return 401 when not authenticated", async () => {
        unauthenticate();
        expect((await getWorkouts()).status).toBe(401);
    });

    it("should return empty array when no workouts", async () => {
        const response = await getWorkouts();
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual([]);
    });

    it("should return user's workouts with programme name", async () => {
        await seedProgramChain(userId);

        const response = await getWorkouts();
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toHaveLength(1);
        expect(data[0].name).toBe("Day A");
        expect(data[0].programme.name).toBe("Prog");
    });

    it("should not return workouts from other users", async () => {
        const other = await prisma.user.create({ data: { username: "wo_other", password_hash: "h" } });
        await seedProgramChain(other.id);

        const response = await getWorkouts();
        expect(await response.json()).toHaveLength(0);
    });
});
