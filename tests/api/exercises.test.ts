/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, it, describe, vi } from "vitest";
import { GET as getExercises, POST as createExercise } from "@/app/api/exercises/route";
import { GET as getLastLog } from "@/app/api/exercises/[exerciseId]/last-log/route";
import { GET as getLogs } from "@/app/api/exercises/[exerciseId]/logs/route";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { createMockRequest } from "@/tests/helpers/request-utils";
import { NextRequest } from "next/server";

describe("Exercises API", () => {
    const userId = "test-user-id";
    const exerciseId = "exercise-1";

    describe("GET /api/exercises", () => {
        it("should return 401 if not authenticated", async () => {
            vi.mocked(auth).mockResolvedValue(null as any);
            createMockRequest("http://localhost:3000/api/exercises");
            const response = await getExercises();
            expect(response.status).toBe(401);
        });

        it("should return exercises for the user", async () => {
            vi.mocked(auth).mockResolvedValue({ user: { id: userId }, expires: "" });
            const mockExercises = [
                { id: "1", name: "Pushups", muscle_group: "Chest" },
                { id: "2", name: "Pullups", muscle_group: "Back" },
            ];
            vi.mocked(prisma.exercise.findMany).mockResolvedValue(mockExercises as any);

            const response = await getExercises();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockExercises);
            expect(prisma.exercise.findMany).toHaveBeenCalled();
        });
    });

    describe("POST /api/exercises", () => {
        it("should create a new exercise", async () => {
            vi.mocked(auth).mockResolvedValue({ user: { id: userId }, expires: "" });
            const body = { name: "Bench Press", muscle_group: "Chest" };
            const mockCreated = { id: "3", ...body, user_id: userId };
            vi.mocked(prisma.exercise.create).mockResolvedValue(mockCreated as any);

            const request = createMockRequest("http://localhost:3000/api/exercises", {
                method: "POST",
                body: JSON.stringify(body),
            });

            const response = await createExercise(request);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data).toEqual(mockCreated);
        });

        it("should return 400 for invalid muscle group", async () => {
            vi.mocked(auth).mockResolvedValue({ user: { id: userId }, expires: "" });
            const body = { name: "Bench Press", muscle_group: "Invalid" };

            const request = createMockRequest("http://localhost:3000/api/exercises", {
                method: "POST",
                body: JSON.stringify(body),
            });

            const response = await createExercise(request);
            expect(response.status).toBe(400);
        });
    });

    describe("GET /api/exercises/[exerciseId]/last-log", () => {
        it("should return the latest log", async () => {
            vi.mocked(auth).mockResolvedValue({ user: { id: userId }, expires: "" });
            const mockLog = { weight: 100, reps: 10 };

            vi.mocked(prisma.exercise.findFirst).mockResolvedValue({ id: exerciseId } as any);
            vi.mocked(prisma.exerciseLog.findFirst).mockResolvedValue(mockLog as any);

            const request = createMockRequest(`http://localhost:3000/api/exercises/${exerciseId}/last-log`);
            const response = await getLastLog(request, { params: Promise.resolve({ exerciseId }) });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockLog);
        });

        it("should return 404 if exercise not found", async () => {
            vi.mocked(auth).mockResolvedValue({ user: { id: userId }, expires: "" });
            vi.mocked(prisma.exercise.findFirst).mockResolvedValue(null);

            const request = createMockRequest(`http://localhost:3000/api/exercises/${exerciseId}/last-log`);
            const response = await getLastLog(request, { params: Promise.resolve({ exerciseId }) });

            expect(response.status).toBe(404);
        });
    });

    describe("GET /api/exercises/[exerciseId]/logs", () => {
        it("should return all logs for the exercise", async () => {
            vi.mocked(auth).mockResolvedValue({ user: { id: userId }, expires: "" });
            const mockLogs = [{ id: "l1", reps: 10 }, { id: "l2", reps: 12 }];
            vi.mocked(prisma.exerciseLog.findMany).mockResolvedValue(mockLogs as any);

            const request = createMockRequest(`http://localhost:3000/api/exercises/${exerciseId}/logs`) as NextRequest;
            const response = await getLogs(request, { params: Promise.resolve({ exerciseId }) });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockLogs);
        });
    });
});
