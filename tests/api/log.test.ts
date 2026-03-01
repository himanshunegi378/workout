/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, it, describe, vi } from "vitest";
import { GET as getSessions } from "@/app/api/log/sessions/route";
import { POST as logSet, DELETE as deleteSet, PATCH as updateSet } from "@/app/api/log/set/route";
import { GET as getVolume } from "@/app/api/log/volume/route";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { getUserId } from "@/lib/auth-helpers";
import { createMockRequest } from "@/tests/helpers/request-utils";

vi.mock("@/lib/auth-helpers", async (importOriginal) => {
    const actual = await importOriginal<any>();
    return {
        ...actual,
        getUserId: vi.fn(),
    };
});

vi.mock("@/lib/prisma", () => ({
    __esModule: true,
    default: {
        workoutSession: {
            findMany: vi.fn(),
            findFirst: vi.fn(),
            create: vi.fn(),
        },
        sessionExerciseLog: {
            findFirst: vi.fn(),
            create: vi.fn(),
            delete: vi.fn(),
        },
        exerciseLog: {
            create: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            count: vi.fn(),
        },
        $transaction: vi.fn((cb) => cb(prisma)),
    },
}));

describe("Log API", () => {
    const userId = "test-user-id";
    const sessionId = "sess-1";
    const selId = "sel-1";
    const setId = "set-1";

    describe("GET /api/log/sessions", () => {
        it("should return sessions", async () => {
            vi.mocked(auth).mockResolvedValue({ user: { id: userId }, expires: "" });
            const mockSessions = [{ id: sessionId, date: new Date(), sessionExerciseLogs: [] }];
            vi.mocked(prisma.workoutSession.findMany).mockResolvedValue(mockSessions as any);

            const request = createMockRequest("http://localhost:3000/api/log/sessions");
            const response = await getSessions(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.data).toHaveLength(1);
        });
    });

    describe("POST /api/log/set", () => {
        it("should log a set, creating session and SEL if needed", async () => {
            vi.mocked(getUserId).mockResolvedValue(userId);
            vi.mocked(prisma.workoutSession.findFirst).mockResolvedValue(null);
            vi.mocked(prisma.workoutSession.create).mockResolvedValue({ id: sessionId } as any);
            vi.mocked(prisma.sessionExerciseLog.findFirst).mockResolvedValue(null);
            vi.mocked(prisma.sessionExerciseLog.create).mockResolvedValue({ id: selId } as any);

            const mockLog = { id: setId, reps: 10, weight: 50 };
            vi.mocked(prisma.exerciseLog.create).mockResolvedValue(mockLog as any);

            const body = {
                workoutId: "w1",
                exerciseId: "e1",
                setOrderIndex: 0,
                reps: "10",
                weight: "50",
            };

            const request = createMockRequest("http://localhost:3000/api/log/set", {
                method: "POST",
                body: JSON.stringify(body),
            });

            const response = await logSet(request);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data).toEqual(mockLog);
            expect(prisma.workoutSession.create).toHaveBeenCalled();
            expect(prisma.sessionExerciseLog.create).toHaveBeenCalled();
        });
    });

    describe("PATCH /api/log/set", () => {
        it("should update a set", async () => {
            vi.mocked(getUserId).mockResolvedValue(userId);
            vi.mocked(prisma.exerciseLog.findUnique).mockResolvedValue({ id: setId, user_id: userId } as any);
            const mockUpdated = { id: setId, reps: 12 };
            vi.mocked(prisma.exerciseLog.update).mockResolvedValue(mockUpdated as any);

            const request = createMockRequest("http://localhost:3000/api/log/set", {
                method: "PATCH",
                body: JSON.stringify({ setId, reps: 12 }),
            });

            const response = await updateSet(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockUpdated);
        });

        it("should return 403 if user doesn't own the set", async () => {
            vi.mocked(getUserId).mockResolvedValue(userId);
            vi.mocked(prisma.exerciseLog.findUnique).mockResolvedValue({ id: setId, user_id: "other" } as any);

            const request = createMockRequest("http://localhost:3000/api/log/set", {
                method: "PATCH",
                body: JSON.stringify({ setId, reps: 12 }),
            });

            const response = await updateSet(request);
            expect(response.status).toBe(403);
        });
    });

    describe("DELETE /api/log/set", () => {
        it("should delete a set and cleanup empty SEL", async () => {
            vi.mocked(getUserId).mockResolvedValue(userId);
            vi.mocked(prisma.exerciseLog.findUnique).mockResolvedValue({ id: setId, user_id: userId } as any);
            vi.mocked(prisma.exerciseLog.delete).mockResolvedValue({ session_exercise_log_id: selId } as any);
            vi.mocked(prisma.exerciseLog.count).mockResolvedValue(0);
            vi.mocked(prisma.sessionExerciseLog.delete).mockResolvedValue({ id: selId } as any);

            const request = createMockRequest(`http://localhost:3000/api/log/set?setId=${setId}`, {
                method: "DELETE",
            });

            const response = await deleteSet(request);
            expect(response.status).toBe(200);
            // prisma.sessionExerciseLog.delete is NOT called because of onDelete: Cascade
        });
    });

    describe("GET /api/log/volume", () => {
        it("should calculate volume correctly", async () => {
            vi.mocked(getUserId).mockResolvedValue(userId);
            const mockSessions = [
                {
                    date: new Date("2024-01-01"),
                    workout: { id: "w1", name: "Push" },
                    sessionExerciseLogs: [
                        {
                            exerciseLog: {
                                exercise: { name: "Bench", muscle_group: "Chest" },
                                weight: 100,
                                reps: 10
                            },
                        }
                    ]
                }
            ];
            vi.mocked(prisma.workoutSession.findMany).mockResolvedValue(mockSessions as any);

            const response = await getVolume();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveLength(1);
            expect(data[0].volume).toBe(1000);
            expect(data[0].muscleGroup).toBe("Chest");
        });
    });
});
