import { describe, it, expect, beforeEach } from "vitest";
import { POST as analyticsQuery } from "@/app/api/analytics/query/route";
import { GET as getFatigue } from "@/app/api/analytics/fatigue/route";
import { GET as getSessionVolume } from "@/app/api/analytics/session-volume/route";
import prisma from "@/lib/prisma";
import { authenticateAs, unauthenticate } from "@/tests/helpers/auth-utils";
import { createMockRequest, jsonReq } from "@/tests/helpers/request-utils";
import { seedUser, seedSession } from "@/tests/helpers/seed-utils";
import { MuscleGroup } from "@/app/generated/prisma/client";
import { NextRequest } from "next/server";

/** A valid minimal analytics query payload. */
const VALID_QUERY = {
    metrics: [{ field: "volume", aggregation: "sum", alias: "total_volume" }],
    dimensions: ["muscle_group"],
};


// ---------------------------------------------------------------------------
// POST /api/analytics/query
// ---------------------------------------------------------------------------

describe("POST /api/analytics/query — Integration", () => {
    let userId: string;

    beforeEach(async () => {
        const user = await seedUser({ username: "analytics_user", password_hash: "hash" });
        userId = user.id;
        authenticateAs(userId);
    });

    it("should return 401 when not authenticated", async () => {
        unauthenticate();
        expect((await analyticsQuery(jsonReq("http://localhost:3000/api/analytics/query", "POST", VALID_QUERY))).status).toBe(401);
    });

    it("should return 400 when payload is invalid (no metrics)", async () => {
        const req = jsonReq("http://localhost:3000/api/analytics/query", "POST", { dimensions: ["muscle_group"] });
        const response = await analyticsQuery(req);
        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.error).toBe("Invalid payload");
    });

    it("should return 400 when metric field is invalid", async () => {
        const req = jsonReq("http://localhost:3000/api/analytics/query", "POST", {
            metrics: [{ field: "invalid_field", aggregation: "sum", alias: "x" }],
        });
        expect((await analyticsQuery(req)).status).toBe(400);
    });

    it("should return 400 when aggregation is invalid", async () => {
        const req = jsonReq("http://localhost:3000/api/analytics/query", "POST", {
            metrics: [{ field: "volume", aggregation: "median", alias: "v" }],
        });
        expect((await analyticsQuery(req)).status).toBe(400);
    });

    it("should return meta and data fields for a valid query", async () => {
        const req = jsonReq("http://localhost:3000/api/analytics/query", "POST", VALID_QUERY);
        const response = await analyticsQuery(req);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toHaveProperty("meta");
        expect(data).toHaveProperty("data");
        expect(data.meta.dimensions).toEqual(["muscle_group"]);
        expect(data.meta.metrics).toEqual(["total_volume"]);
    });

    it("should return data from the analytics view when logs exist", async () => {
        await seedSession(userId, new Date());

        const req = jsonReq("http://localhost:3000/api/analytics/query", "POST", VALID_QUERY);
        const response = await analyticsQuery(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.data.length).toBeGreaterThanOrEqual(1);
    });
});

// ---------------------------------------------------------------------------
// GET /api/analytics/fatigue
// ---------------------------------------------------------------------------

describe("GET /api/analytics/fatigue — Integration", () => {
    let userId: string;

    beforeEach(async () => {
        const user = await seedUser({ username: "fatigue_user", password_hash: "hash" });
        userId = user.id;
        authenticateAs(userId);
    });

    it("should return 401 when not authenticated", async () => {
        unauthenticate();
        const req = createMockRequest("http://localhost:3000/api/analytics/fatigue");
        expect((await getFatigue(req)).status).toBe(401);
    });

    it("should return timeSeries and hasMoreHistory for a user with no logs", async () => {
        const req = createMockRequest("http://localhost:3000/api/analytics/fatigue");
        const response = await getFatigue(req);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toHaveProperty("timeSeries");
        expect(data).toHaveProperty("hasMoreHistory");
        expect(Array.isArray(data.timeSeries)).toBe(true);
        expect(data.hasMoreHistory).toBe(false);
    });

    it("should return 30 days of time series by default", async () => {
        const req = createMockRequest("http://localhost:3000/api/analytics/fatigue");
        const response = await getFatigue(req);
        const data = await response.json();

        expect(data.timeSeries).toHaveLength(30);
    });

    it("should return custom days count via query param", async () => {
        const req = createMockRequest("http://localhost:3000/api/analytics/fatigue?days=7");
        const response = await getFatigue(req);
        const data = await response.json();

        expect(data.timeSeries).toHaveLength(7);
    });

    it("should reflect training data in the timeSeries when logs exist", async () => {
        // Seed a log for today (not Cardio)
        const exercise = await prisma.exercise.create({
            data: { name: "Bench", muscle_group: MuscleGroup.Chest, user_id: userId },
        });
        await prisma.exerciseLog.create({
            data: { reps: 10, weight: 80, set_order_index: 0, user_id: userId, exerciseId: exercise.id, date: new Date() },
        });

        const req = createMockRequest("http://localhost:3000/api/analytics/fatigue?days=7");
        const response = await getFatigue(req);
        const data = await response.json();

        // Today's entry should reflect the seeded log: ACWR output has acuteLoad (7-day),
        // chronicLoad (28-day), ratio, isCalibrating — NOT totalSets
        const today = new Date().toISOString().split("T")[0];
        const todayEntry = data.timeSeries.find((d: { date: string }) => d.date === today);
        expect(todayEntry).toBeDefined();
        expect(todayEntry.acuteLoad).toBeGreaterThan(0);
        expect(todayEntry).toHaveProperty("chronicLoad");
        expect(todayEntry).toHaveProperty("ratio");
        expect(todayEntry).toHaveProperty("isCalibrating");
    });
});

// ---------------------------------------------------------------------------
// GET /api/analytics/session-volume
// ---------------------------------------------------------------------------

describe("GET /api/analytics/session-volume — Integration", () => {
    let userId: string;

    beforeEach(async () => {
        const user = await seedUser({ username: "sv_user", password_hash: "hash" });
        userId = user.id;
        authenticateAs(userId);
    });

    it("should return 401 when not authenticated", async () => {
        unauthenticate();
        const req = createMockRequest("http://localhost:3000/api/analytics/session-volume?workoutId=x") as NextRequest;
        expect((await getSessionVolume(req)).status).toBe(401);
    });

    it("should return 400 when workoutId is missing", async () => {
        const req = createMockRequest("http://localhost:3000/api/analytics/session-volume") as NextRequest;
        const response = await getSessionVolume(req);
        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.error).toMatch(/workoutId/);
    });

    it("should return empty array when no logs for the workout", async () => {
        const req = createMockRequest("http://localhost:3000/api/analytics/session-volume?workoutId=ghost") as NextRequest;
        const response = await getSessionVolume(req);

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual([]);
    });

    it("should return session volume data when logs exist", async () => {
        const { workout } = await seedSession(userId, new Date());

        const req = createMockRequest(
            `http://localhost:3000/api/analytics/session-volume?workoutId=${workout.id}`
        ) as NextRequest;
        const response = await getSessionVolume(req);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toHaveLength(1);
        expect(data[0]).toMatchObject({
            volume: 800, // 80 weight * 10 reps
            status: "neutral", // first session — no previous to compare
        });
        expect(data[0].date).toBeDefined();
    });

    it("should apply limit param correctly", async () => {
        // Seed data — seedSession will create 1 session
        const { workout } = await seedSession(userId, new Date());

        const req = createMockRequest(
            `http://localhost:3000/api/analytics/session-volume?workoutId=${workout.id}&limit=1`
        ) as NextRequest;
        const response = await getSessionVolume(req);
        const data = await response.json();

        expect(data).toHaveLength(1);
    });
});
