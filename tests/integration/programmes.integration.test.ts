import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/programmes/route";
import { GET as getProgramme } from "@/app/api/programmes/[programmeId]/route";
import { POST as createWorkout } from "@/app/api/programmes/[programmeId]/workouts/route";
import prisma from "@/lib/prisma";
import { authenticateAs, unauthenticate } from "@/tests/helpers/auth-utils";
import { createMockRequest, jsonReq, makeParams } from "@/tests/helpers/request-utils";
import { seedUser } from "@/tests/helpers/seed-utils";
import { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Programmes API — Integration", () => {
    let userId: string;

    beforeEach(async () => {
        const user = await seedUser({ username: "prog_user", password_hash: "hash" });
        userId = user.id;
        authenticateAs(userId);
    });

    // -----------------------------------------------------------------------
    // GET /api/programmes
    // -----------------------------------------------------------------------

    describe("GET /api/programmes", () => {
        it("should return 401 when not authenticated", async () => {
            unauthenticate();
            expect((await GET()).status).toBe(401);
        });

        it("should return empty array when no programmes", async () => {
            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual([]);
        });

        it("should return only the user's programmes ordered by name", async () => {
            await prisma.programme.createMany({
                data: [
                    { name: "Zumba", user_id: userId },
                    { name: "Alpha", user_id: userId },
                ],
            });

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveLength(2);
            expect(data[0].name).toBe("Alpha");
            expect(data[1].name).toBe("Zumba");
        });

        it("should not return other users' programmes", async () => {
            const other = await prisma.user.create({ data: { username: "prog_other", password_hash: "h" } });
            await prisma.programme.create({ data: { name: "Other Prog", user_id: other.id } });
            await prisma.programme.create({ data: { name: "My Prog", user_id: userId } });

            const response = await GET();
            const data = await response.json();

            expect(data).toHaveLength(1);
            expect(data[0].name).toBe("My Prog");
        });

        it("should include workouts count in the response", async () => {
            const prog = await prisma.programme.create({ data: { name: "PPL", user_id: userId } });
            await prisma.workout.create({
                data: { name: "Push", order_index: 0, programme_id: prog.id },
            });

            const response = await GET();
            const data = await response.json();

            expect(data[0].workouts).toHaveLength(1);
        });
    });

    // -----------------------------------------------------------------------
    // POST /api/programmes
    // -----------------------------------------------------------------------

    describe("POST /api/programmes", () => {
        it("should return 401 when not authenticated", async () => {
            unauthenticate();
            const req = jsonReq("http://localhost:3000/api/programmes", "POST", { name: "PPL" });
            expect((await POST(req)).status).toBe(401);
        });

        it("should create a programme and return 201", async () => {
            const req = jsonReq("http://localhost:3000/api/programmes", "POST", {
                name: "Push Pull Legs",
                description: "Classic split",
            });
            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data).toMatchObject({ name: "Push Pull Legs", description: "Classic split", user_id: userId });
        });

        it("should return 400 when name is missing", async () => {
            const req = jsonReq("http://localhost:3000/api/programmes", "POST", { description: "No name" });
            expect((await POST(req)).status).toBe(400);
        });

        it("should return 400 when name is empty", async () => {
            const req = jsonReq("http://localhost:3000/api/programmes", "POST", { name: "  " });
            expect((await POST(req)).status).toBe(400);
        });
    });

    // -----------------------------------------------------------------------
    // GET /api/programmes/[programmeId]
    // -----------------------------------------------------------------------

    describe("GET /api/programmes/[programmeId]", () => {
        it("should return 401 when not authenticated", async () => {
            unauthenticate();
            const req = createMockRequest("http://localhost:3000/api/programmes/any") as NextRequest;
            expect((await getProgramme(req, makeParams({ programmeId: "any" }))).status).toBe(401);
        });

        it("should return 404 when programme does not exist", async () => {
            const req = createMockRequest("http://localhost:3000/api/programmes/nonexistent") as NextRequest;
            const response = await getProgramme(req, makeParams({ programmeId: "nonexistent" }));
            expect(response.status).toBe(404);
        });

        it("should return 404 when programme belongs to another user", async () => {
            const other = await prisma.user.create({ data: { username: "prog_other2", password_hash: "h" } });
            const prog = await prisma.programme.create({ data: { name: "Other", user_id: other.id } });

            const req = createMockRequest(`http://localhost:3000/api/programmes/${prog.id}`) as NextRequest;
            const response = await getProgramme(req, makeParams({ programmeId: prog.id }));
            expect(response.status).toBe(404);
        });

        it("should return programme with workouts", async () => {
            const prog = await prisma.programme.create({ data: { name: "Strength", user_id: userId } });
            await prisma.workout.create({ data: { name: "Day A", order_index: 0, programme_id: prog.id } });

            const req = createMockRequest(`http://localhost:3000/api/programmes/${prog.id}`) as NextRequest;
            const response = await getProgramme(req, makeParams({ programmeId: prog.id }));
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.name).toBe("Strength");
            expect(data.workouts).toHaveLength(1);
            expect(data.workouts[0].name).toBe("Day A");
        });
    });

    // -----------------------------------------------------------------------
    // POST /api/programmes/[programmeId]/workouts
    // -----------------------------------------------------------------------

    describe("POST /api/programmes/[programmeId]/workouts", () => {
        it("should return 401 when not authenticated", async () => {
            unauthenticate();
            const req = jsonReq("http://localhost:3000/api/programmes/any/workouts", "POST", { name: "Push" });
            expect((await createWorkout(req, makeParams({ programmeId: "any" }))).status).toBe(401);
        });

        it("should return 404 when programme does not exist", async () => {
            const req = jsonReq("http://localhost:3000/api/programmes/ghost/workouts", "POST", { name: "Push" });
            expect((await createWorkout(req, makeParams({ programmeId: "ghost" }))).status).toBe(404);
        });

        it("should return 400 when workout name is missing", async () => {
            const prog = await prisma.programme.create({ data: { name: "PPL", user_id: userId } });
            const req = jsonReq(`http://localhost:3000/api/programmes/${prog.id}/workouts`, "POST", {});
            expect((await createWorkout(req, makeParams({ programmeId: prog.id }))).status).toBe(400);
        });

        it("should create a workout with correct order_index and return 201", async () => {
            const prog = await prisma.programme.create({ data: { name: "GZCLP", user_id: userId } });

            // First workout → order_index should be 0
            const req1 = jsonReq(`http://localhost:3000/api/programmes/${prog.id}/workouts`, "POST", { name: "T1" });
            const r1 = await createWorkout(req1, makeParams({ programmeId: prog.id }));
            expect(r1.status).toBe(201);
            expect((await r1.json()).order_index).toBe(0);

            // Second workout → order_index should be 1
            const req2 = jsonReq(`http://localhost:3000/api/programmes/${prog.id}/workouts`, "POST", { name: "T2" });
            const r2 = await createWorkout(req2, makeParams({ programmeId: prog.id }));
            expect((await r2.json()).order_index).toBe(1);
        });
    });
});
