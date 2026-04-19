/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, it, describe, vi } from "vitest";
import { GET as getProgrammes, POST as createProgramme } from "@/app/api/programmes/route";
import { GET as getProgramme } from "@/app/api/programmes/[programmeId]/route";
import { POST as createWorkout } from "@/app/api/programmes/[programmeId]/workouts/route";
import { GET as getWorkoutDetails } from "@/app/api/programmes/[programmeId]/workouts/[workoutId]/details/route";
import { POST as linkExercise } from "@/app/api/programmes/[programmeId]/workouts/[workoutId]/exercises/route";
import { PATCH as updateExerciseMetadata } from "@/app/api/programmes/[programmeId]/workouts/[workoutId]/exercises/[metadataId]/route";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
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

describe("Programmes API", () => {
    const userId = "test-user-id";
    const programmeId = "prog-1";
    const workoutId = "work-1";
    const metadataId = "meta-1";

    describe("GET /api/programmes", () => {
        it("should return all programmes for user", async () => {
            vi.mocked(getUserId).mockResolvedValue(userId);
            const mockProgs = [{ id: "p1", name: "PPL", workouts: [] }];
            vi.mocked(prisma.programme.findMany).mockResolvedValue(mockProgs as any);

            const response = await getProgrammes();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockProgs);
        });
    });

    describe("POST /api/programmes", () => {
        it("should create a programme", async () => {
            vi.mocked(getUserId).mockResolvedValue(userId);
            const body = { name: "New Programme" };
            const mockCreated = { id: "p2", ...body, user_id: userId };
            vi.mocked(prisma.programme.create).mockResolvedValue(mockCreated as any);

            const request = createMockRequest("http://localhost:3000/api/programmes", {
                method: "POST",
                body: JSON.stringify(body),
            });

            const response = await createProgramme(request);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data).toEqual(mockCreated);
        });
    });

    describe("GET /api/programmes/[programmeId]", () => {
        it("should return programme details", async () => {
            vi.mocked(auth).mockResolvedValue({ user: { id: userId }, expires: "" });
            const mockProg = { id: programmeId, name: "PPL", workouts: [] };
            vi.mocked(prisma.programme.findFirst).mockResolvedValue(mockProg as any);

            const request = createMockRequest(`http://localhost:3000/api/programmes/${programmeId}`) as NextRequest;
            const response = await getProgramme(request, { params: Promise.resolve({ programmeId }) });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockProg);
        });
    });

    describe("POST /api/programmes/[programmeId]/workouts", () => {
        it("should add a workout to a programme", async () => {
            vi.mocked(getUserId).mockResolvedValue(userId);
            vi.mocked(prisma.programme.findFirst).mockResolvedValue({ _count: { workouts: 0 } } as any);
            const mockWorkout = { id: workoutId, name: "Push Day", programme_id: programmeId };
            vi.mocked(prisma.workout.create).mockResolvedValue(mockWorkout as any);

            const request = createMockRequest(`http://localhost:3000/api/programmes/${programmeId}/workouts`, {
                method: "POST",
                body: JSON.stringify({ name: "Push Day" }),
            });

            const response = await createWorkout(request, { params: Promise.resolve({ programmeId }) });
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data).toEqual(mockWorkout);
        });
    });

    describe("GET /api/programmes/.../details", () => {
        it("should return full workout details", async () => {
            vi.mocked(auth).mockResolvedValue({ user: { id: userId }, expires: "" });
            const mockWorkout = { id: workoutId, name: "Push", exercisesWithMetadata: [] };
            vi.mocked(prisma.workout.findFirst).mockResolvedValue(mockWorkout as any);
            vi.mocked(prisma.workoutSession.findFirst).mockResolvedValue(null);

            const request = createMockRequest(`http://localhost:3000/api/programmes/${programmeId}/workouts/${workoutId}/details`) as NextRequest;
            const response = await getWorkoutDetails(request, { params: Promise.resolve({ programmeId, workoutId }) });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.workout).toEqual(mockWorkout);
        });
    });

    describe("POST /api/programmes/.../exercises", () => {
        it("should link an exercise to a workout using the visible exercise count for order", async () => {
            vi.mocked(getUserId).mockResolvedValue(userId);
            vi.mocked(prisma.workout.findFirst).mockResolvedValue({ _count: { exercisesWithMetadata: 2 } } as any);
            const mockEwm = { id: metadataId, exercise_id: "e1", workout_id: workoutId };
            vi.mocked(prisma.exerciseWithMetadata.create).mockResolvedValue(mockEwm as any);

            const request = createMockRequest(`http://localhost:3000/api/programmes/${programmeId}/workouts/${workoutId}/exercises`, {
                method: "POST",
                body: JSON.stringify({ exercise_id: "e1", sets_min: 3, sets_max: 3, reps_min: 8, reps_max: 12 }),
            });

            const response = await linkExercise(request, { params: Promise.resolve({ programmeId, workoutId }) });
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data).toEqual(mockEwm);
            expect(prisma.workout.findFirst).toHaveBeenCalledWith({
                where: {
                    id: workoutId,
                    programme: { id: programmeId, user_id: userId },
                },
                include: {
                    _count: {
                        select: {
                            exercisesWithMetadata: {
                                where: { is_hidden: false },
                            },
                        },
                    },
                },
            });
            expect(prisma.exerciseWithMetadata.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    workout_id: workoutId,
                    exercise_id: "e1",
                    order_index: 2,
                }),
            });
        });
    });

    describe("PATCH /api/programmes/.../exercises/[metadataId]", () => {
        it("should update metadata in place if no session exists", async () => {
            vi.mocked(getUserId).mockResolvedValue(userId);
            vi.mocked(prisma.exerciseWithMetadata.findFirst).mockResolvedValue({ id: metadataId } as any);
            vi.mocked(prisma.workoutSession.findFirst).mockResolvedValue(null);

            const mockUpdated = { id: metadataId, reps_min: 10 };
            vi.mocked(prisma.exerciseWithMetadata.update).mockResolvedValue(mockUpdated as any);

            const request = createMockRequest(`http://localhost:3000/api/programmes/${programmeId}/workouts/${workoutId}/exercises/${metadataId}`, {
                method: "PATCH",
                body: JSON.stringify({ reps_min: 10 }),
            });

            const response = await updateExerciseMetadata(request, { params: Promise.resolve({ programmeId, workoutId, metadataId }) });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockUpdated);
            expect(prisma.exerciseWithMetadata.update).toHaveBeenCalled();
        });

        it("should create new metadata and hide old one if session exists", async () => {
            vi.mocked(getUserId).mockResolvedValue(userId);
            vi.mocked(prisma.exerciseWithMetadata.findFirst).mockResolvedValue({ id: metadataId, exercise_id: "e1", order_index: 0 } as any);
            vi.mocked(prisma.workoutSession.findFirst).mockResolvedValue({ id: "s1" } as any);

            const mockNew = { id: "meta-new", reps_min: 10 };
            // Mock transaction results
            vi.mocked(prisma.exerciseWithMetadata.create).mockResolvedValue(mockNew as any);
            vi.mocked(prisma.exerciseWithMetadata.update).mockResolvedValue({ id: metadataId, is_hidden: true } as any);

            const request = createMockRequest(`http://localhost:3000/api/programmes/${programmeId}/workouts/${workoutId}/exercises/${metadataId}`, {
                method: "PATCH",
                body: JSON.stringify({ reps_min: 10 }),
            });

            const response = await updateExerciseMetadata(request, { params: Promise.resolve({ programmeId, workoutId, metadataId }) });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockNew); // The first element of transaction result is returned as 'result'
            expect(prisma.exerciseWithMetadata.create).toHaveBeenCalled();
            expect(prisma.exerciseWithMetadata.update).toHaveBeenCalled();
        });
    });
});
