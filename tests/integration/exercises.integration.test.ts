import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/exercises/route";
import prisma from "@/lib/prisma";
import { authenticateAs, unauthenticate } from "@/tests/helpers/auth-utils";
import { createMockRequest, jsonReq } from "@/tests/helpers/request-utils";
import { seedSession, seedUser, TEST_USER_DATA, OTHER_USER_DATA } from "@/tests/helpers/seed-utils";

// ---------------------------------------------------------------------------
// Integration Tests
// ---------------------------------------------------------------------------

describe("Exercises API — Integration", () => {
    let userId: string;

    beforeEach(async () => {
        // Seed a fresh user for every test (DB is truncated by setup.ts)
        const user = await seedUser(TEST_USER_DATA);
        userId = user.id;
        authenticateAs(userId);
    });

    // -----------------------------------------------------------------------
    // POST /api/exercises
    // -----------------------------------------------------------------------

    describe("POST /api/exercises", () => {
        it("should create a valid exercise and return 201", async () => {
            const request = jsonReq("http://localhost:3000/api/exercises", "POST", {
                name: "Bench Press",
                muscle_group: "Chest",
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data).toMatchObject({
                name: "Bench Press",
                muscle_group: "Chest",
                user_id: userId,
            });
            expect(data.id).toBeDefined();
        });

        it("should persist the exercise in the database", async () => {
            const request = jsonReq("http://localhost:3000/api/exercises", "POST", {
                name: "Deadlift",
                muscle_group: "Back",
            });

            const response = await POST(request);
            const data = await response.json();

            const dbRecord = await prisma.exercise.findUnique({
                where: { id: data.id },
            });

            expect(dbRecord).not.toBeNull();
            expect(dbRecord!.name).toBe("Deadlift");
            expect(dbRecord!.muscle_group).toBe("Back");
            expect(dbRecord!.user_id).toBe(userId);
        });

        it("should store description correctly", async () => {
            const request = jsonReq("http://localhost:3000/api/exercises", "POST", {
                name: "Squat",
                muscle_group: "Legs",
                description: "Barbell back squat with full ROM",
            });

            const response = await POST(request);
            const data = await response.json();

            const dbRecord = await prisma.exercise.findUnique({
                where: { id: data.id },
            });

            expect(response.status).toBe(201);
            expect(data.description).toBe("Barbell back squat with full ROM");
            expect(dbRecord!.description).toBe("Barbell back squat with full ROM");
        });

        it("should return 400 when name is missing", async () => {
            const request = jsonReq("http://localhost:3000/api/exercises", "POST", { muscle_group: "Chest" });
            const response = await POST(request);

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toBeDefined();
        });

        it("should return 400 when name is an empty string", async () => {
            const request = jsonReq("http://localhost:3000/api/exercises", "POST", {
                name: "   ",
                muscle_group: "Chest",
            });
            const response = await POST(request);

            expect(response.status).toBe(400);
        });

        it("should return 400 when muscle_group is invalid", async () => {
            const request = jsonReq("http://localhost:3000/api/exercises", "POST", {
                name: "Curl",
                muscle_group: "InvalidGroup",
            });
            const response = await POST(request);

            expect(response.status).toBe(400);
        });

        it("should return 400 when muscle_group is missing", async () => {
            const request = jsonReq("http://localhost:3000/api/exercises", "POST", { name: "Curl" });
            const response = await POST(request);

            expect(response.status).toBe(400);
        });

        it("should return 401 when not authenticated", async () => {
            unauthenticate();

            const request = jsonReq("http://localhost:3000/api/exercises", "POST", {
                name: "Pushup",
                muscle_group: "Chest",
            });
            const response = await POST(request);

            expect(response.status).toBe(401);
        });
    });

    // -----------------------------------------------------------------------
    // GET /api/exercises
    // -----------------------------------------------------------------------

    describe("GET /api/exercises", () => {
        it("should return an empty array when no exercises exist", async () => {
            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual([]);
        });

        it("should return user's own exercises (and any with user_id='system')", async () => {
            // The route queries: OR [{ user_id: userId }, { user_id: "system" }]
            // The string "system" is a reserved literal, not a real DB user (FK constraint
            // prevents seeding a User row with id="system"). So we only verify the
            // user-owned path here.
            await prisma.exercise.createMany({
                data: [
                    { name: "Pushup", muscle_group: "Chest", user_id: userId },
                    { name: "Pullup", muscle_group: "Back", user_id: userId },
                ],
            });

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveLength(2);
            expect(data.map((e: { name: string }) => e.name)).toEqual(
                expect.arrayContaining(["Pullup", "Pushup"]),
            );
        });

        it("should return only exercises belonging to the authenticated user", async () => {
            const other = await seedUser(OTHER_USER_DATA);

            await prisma.exercise.createMany({
                data: [
                    { name: "Bench Press", muscle_group: "Chest", user_id: userId },
                    { name: "Curl", muscle_group: "Biceps", user_id: other.id },
                ],
            });

            const request = createMockRequest("http://localhost:3000/api/exercises");
            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveLength(1);
            expect(data[0].name).toBe("Bench Press");
        });

        it("should NOT return exercises belonging to other users", async () => {
            const otherUser = await seedUser(OTHER_USER_DATA);

            await prisma.exercise.createMany({
                data: [
                    { name: "Bench Press", muscle_group: "Chest", user_id: userId },
                    { name: "Curl", muscle_group: "Biceps", user_id: otherUser.id },
                ],
            });

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveLength(1);
            expect(data[0].name).toBe("Bench Press");
        });

        it("should order results by muscle_group asc, then name asc", async () => {
            await prisma.exercise.createMany({
                data: [
                    { name: "Tricep Dip", muscle_group: "Triceps", user_id: userId },
                    { name: "Bench Press", muscle_group: "Chest", user_id: userId },
                    { name: "Cable Fly", muscle_group: "Chest", user_id: userId },
                    { name: "Lat Pulldown", muscle_group: "Back", user_id: userId },
                ],
            });

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveLength(4);

            // Expected order: Back → Chest (Bench Press) → Chest (Cable Fly) → Triceps
            expect(data[0].name).toBe("Lat Pulldown");
            expect(data[1].name).toBe("Bench Press");
            expect(data[2].name).toBe("Cable Fly");
            expect(data[3].name).toBe("Tricep Dip");
        });

        it("should return only id, name, description, muscle_group (no user_id)", async () => {
            await prisma.exercise.create({
                data: {
                    name: "Squat",
                    description: "Back squat",
                    muscle_group: "Legs",
                    user_id: userId,
                },
            });

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveLength(1);

            const exercise = data[0];
            expect(Object.keys(exercise).sort()).toEqual(
                ["description", "id", "muscle_group", "name"].sort()
            );
            expect(exercise.user_id).toBeUndefined();
        });

        it("should return 401 when not authenticated", async () => {
            unauthenticate();
            const response = await GET();

            expect(response.status).toBe(401);
        });
    });
});
