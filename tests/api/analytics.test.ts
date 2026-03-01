/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, it, describe, vi } from "vitest";
import { GET as getFatigue } from "@/app/api/analytics/fatigue/route";
import { POST as queryAnalytics } from "@/app/api/analytics/query/route";
import { GET as getSessionVolume } from "@/app/api/analytics/session-volume/route";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";
import { createMockRequest } from "@/tests/helpers/request-utils";
import { NextRequest } from "next/server";

vi.mock("@/lib/auth-helpers", async (importOriginal) => {
    const actual = await importOriginal<any>();
    return {
        ...actual,
        getUserId: vi.fn(),
    };
});

// Mock internal feature services if needed
vi.mock("@/app/features/analytics/server/analytics-service", () => ({
    buildAnalyticsQuery: vi.fn().mockResolvedValue([]),
}));

describe("Analytics API", () => {
    const userId = "test-user-id";

    describe("GET /api/analytics/fatigue", () => {
        it("should return fatigue data", async () => {
            vi.mocked(getUserId).mockResolvedValue(userId);
            vi.mocked(prisma.exerciseLog.findFirst).mockResolvedValue({ date: new Date() } as any);
            vi.mocked(prisma.exerciseLog.findMany).mockResolvedValue([]);

            const request = createMockRequest("http://localhost:3000/api/analytics/fatigue");
            const response = await getFatigue(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveProperty("timeSeries");
        });
    });

    describe("POST /api/analytics/query", () => {
        it("should execute analytics query", async () => {
            vi.mocked(getUserId).mockResolvedValue(userId);
            const body = {
                dimensions: ["muscle_group"],
                metrics: [{ field: "volume", aggregation: "sum", alias: "vol" }],
                filters: []
            };

            const request = createMockRequest("http://localhost:3000/api/analytics/query", {
                method: "POST",
                body: JSON.stringify(body),
            });

            const response = await queryAnalytics(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.meta.dimensions).toContain("muscle_group");
        });

        it("should return 400 for invalid payload", async () => {
            vi.mocked(getUserId).mockResolvedValue(userId);
            const request = createMockRequest("http://localhost:3000/api/analytics/query", {
                method: "POST",
                body: JSON.stringify({ invalid: true }),
            });

            const response = await queryAnalytics(request);
            expect(response.status).toBe(400);
        });
    });

    describe("GET /api/analytics/session-volume", () => {
        it("should return volume deltas", async () => {
            vi.mocked(getUserId).mockResolvedValue(userId);
            const mockLogs = [
                { workout_session_id: "s1", session_date: new Date("2024-01-01"), volume: 1000 },
                { workout_session_id: "s2", session_date: new Date("2024-01-02"), volume: 1100 },
            ];
            vi.mocked(prisma.exercise_analytics_view.findMany).mockResolvedValue(mockLogs as any);

            const request = createMockRequest("http://localhost:3000/api/analytics/session-volume?workoutId=w1") as NextRequest;
            const response = await getSessionVolume(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveLength(2);
            expect(data[1].deltaPercentage).toBe(10);
            expect(data[1].status).toBe("warning"); // > 5% is warning based on code
        });

        it("should return 400 if workoutId is missing", async () => {
            vi.mocked(getUserId).mockResolvedValue(userId);
            const request = createMockRequest("http://localhost:3000/api/analytics/session-volume") as NextRequest;
            const response = await getSessionVolume(request);
            expect(response.status).toBe(400);
        });
    });
});
