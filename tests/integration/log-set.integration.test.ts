import { describe, it, expect, beforeEach } from "vitest";
import { POST, DELETE, PATCH } from "@/app/api/log/set/route";
import prisma from "@/lib/prisma";
import { authenticateAs, unauthenticate } from "@/tests/helpers/auth-utils";
import { createMockRequest, jsonReq } from "@/tests/helpers/request-utils";
import { seedUser } from "@/tests/helpers/seed-utils";
import { MuscleGroup } from "@/app/generated/prisma/client";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function deleteReq(setId: string) {
    return createMockRequest(`http://localhost:3000/api/log/set?setId=${setId}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Log/Set API — Integration", () => {
    let userId: string;
    let exerciseId: string;

    beforeEach(async () => {
        const user = await seedUser({ username: "logset_user", password_hash: "hash" });
        userId = user.id;
        const exercise = await prisma.exercise.create({
            data: { name: "Squat", muscle_group: MuscleGroup.Legs, user_id: userId },
        });
        exerciseId = exercise.id;
        authenticateAs(userId);
    });

    // -----------------------------------------------------------------------
    // POST /api/log/set
    // -----------------------------------------------------------------------

    describe("POST /api/log/set", () => {
        it("should return 401 when not authenticated", async () => {
            unauthenticate();
            const req = jsonReq("http://localhost:3000/api/log/set", "POST", {
                setOrderIndex: 0, reps: 10, exerciseId,
            });
            expect((await POST(req)).status).toBe(401);
        });

        it("should return 400 when reps is missing", async () => {
            const req = jsonReq("http://localhost:3000/api/log/set", "POST", {
                setOrderIndex: 0, exerciseId,
            });
            expect((await POST(req)).status).toBe(400);
        });

        it("should return 400 when setOrderIndex is missing", async () => {
            const req = jsonReq("http://localhost:3000/api/log/set", "POST", {
                reps: 10, exerciseId,
            });
            expect((await POST(req)).status).toBe(400);
        });

        it("should create an ExerciseLog and return 201", async () => {
            const req = jsonReq("http://localhost:3000/api/log/set", "POST", {
                setOrderIndex: 0, reps: 10, weight: "80", exerciseId,
            });
            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data).toMatchObject({ reps: 10, weight: 80 });
            expect(data.id).toBeDefined();
        });

        it("should auto-create a WorkoutSession for today if none exists", async () => {
            const beforeCount = await prisma.workoutSession.count({ where: { user_id: userId } });

            const req = jsonReq("http://localhost:3000/api/log/set", "POST", {
                setOrderIndex: 0, reps: 8, exerciseId,
            });
            await POST(req);

            const afterCount = await prisma.workoutSession.count({ where: { user_id: userId } });
            expect(afterCount).toBe(beforeCount + 1);
        });

        it("should reuse today's session on a second log", async () => {
            const body = { setOrderIndex: 0, reps: 8, exerciseId };
            await POST(jsonReq("http://localhost:3000/api/log/set", "POST", body));

            const sessionCountBefore = await prisma.workoutSession.count({ where: { user_id: userId } });

            await POST(jsonReq("http://localhost:3000/api/log/set", "POST", { ...body, setOrderIndex: 1 }));

            expect(await prisma.workoutSession.count({ where: { user_id: userId } })).toBe(sessionCountBefore);
        });

        it("should create a SessionExerciseLog joined to the ExerciseLog", async () => {
            const req = jsonReq("http://localhost:3000/api/log/set", "POST", {
                setOrderIndex: 0, reps: 12, exerciseId,
            });
            const response = await POST(req);
            const data = await response.json();

            const sel = await prisma.sessionExerciseLog.findFirst({
                where: { exercise_log_id: data.id },
            });
            expect(sel).not.toBeNull();
        });
    });

    // -----------------------------------------------------------------------
    // DELETE /api/log/set
    // -----------------------------------------------------------------------

    describe("DELETE /api/log/set", () => {
        it("should return 401 when not authenticated", async () => {
            unauthenticate();
            expect((await DELETE(deleteReq("any-id"))).status).toBe(401);
        });

        it("should return 400 when setId is missing", async () => {
            const req = createMockRequest("http://localhost:3000/api/log/set", { method: "DELETE" });
            expect((await DELETE(req)).status).toBe(400);
        });

        it("should return 404 when set does not exist", async () => {
            expect((await DELETE(deleteReq("nonexistent-id"))).status).toBe(404);
        });

        it("should return 403 when set belongs to another user", async () => {
            const other = await prisma.user.create({ data: { username: "other_del", password_hash: "h" } });
            const log = await prisma.exerciseLog.create({
                data: { reps: 5, set_order_index: 0, user_id: other.id },
            });

            expect((await DELETE(deleteReq(log.id))).status).toBe(403);
        });

        it("should delete the set and return 200", async () => {
            const log = await prisma.exerciseLog.create({
                data: { reps: 10, set_order_index: 0, user_id: userId },
            });

            const response = await DELETE(deleteReq(log.id));
            expect(response.status).toBe(200);

            const deleted = await prisma.exerciseLog.findUnique({ where: { id: log.id } });
            expect(deleted).toBeNull();
        });
    });

    // -----------------------------------------------------------------------
    // PATCH /api/log/set
    // -----------------------------------------------------------------------

    describe("PATCH /api/log/set", () => {
        it("should return 401 when not authenticated", async () => {
            unauthenticate();
            const req = jsonReq("http://localhost:3000/api/log/set", "PATCH", { setId: "x", reps: 5 });
            expect((await PATCH(req)).status).toBe(401);
        });

        it("should return 400 when setId is missing", async () => {
            const req = jsonReq("http://localhost:3000/api/log/set", "PATCH", { reps: 5 });
            expect((await PATCH(req)).status).toBe(400);
        });

        it("should return 400 when reps is missing", async () => {
            const req = jsonReq("http://localhost:3000/api/log/set", "PATCH", { setId: "x" });
            expect((await PATCH(req)).status).toBe(400);
        });

        it("should return 404 when set does not exist", async () => {
            const req = jsonReq("http://localhost:3000/api/log/set", "PATCH", { setId: "nonexistent", reps: 5 });
            expect((await PATCH(req)).status).toBe(404);
        });

        it("should return 403 when set belongs to another user", async () => {
            const other = await prisma.user.create({ data: { username: "other_patch", password_hash: "h" } });
            const log = await prisma.exerciseLog.create({
                data: { reps: 5, set_order_index: 0, user_id: other.id },
            });
            const req = jsonReq("http://localhost:3000/api/log/set", "PATCH", { setId: log.id, reps: 10 });
            expect((await PATCH(req)).status).toBe(403);
        });

        it("should update reps and weight and return 200", async () => {
            const log = await prisma.exerciseLog.create({
                data: { reps: 5, weight: 50, set_order_index: 0, user_id: userId },
            });

            const req = jsonReq("http://localhost:3000/api/log/set", "PATCH", {
                setId: log.id, reps: 8, weight: "60",
            });
            const response = await PATCH(req);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toMatchObject({ reps: 8, weight: 60 });

            const updated = await prisma.exerciseLog.findUnique({ where: { id: log.id } });
            expect(updated!.reps).toBe(8);
            expect(updated!.weight).toBe(60);
        });
    });
});
