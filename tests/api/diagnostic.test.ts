/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, it, describe, vi } from "vitest";
import { POST } from "@/app/api/exercises/route";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { createMockRequest } from "@/tests/helpers/request-utils";

describe("Diagnostic API Test", () => {
    it("should mock auth and prisma correctly", async () => {
        // Mock session
        vi.mocked(auth).mockResolvedValue({
            user: { id: "test-user-id" },
            expires: "any",
        } as any);

        // Mock Prisma create
        const mockExercise = {
            id: "exercise-1",
            name: "Pushups",
            muscle_group: "CHEST",
            user_id: "test-user-id",
        };
        vi.mocked(prisma.exercise.create).mockResolvedValue(mockExercise as any);

        const request = createMockRequest("http://localhost:3000/api/exercises", {
            method: "POST",
            body: JSON.stringify({
                name: "Pushups",
                muscle_group: "Chest",
            }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data).toEqual(mockExercise);
        expect(prisma.exercise.create).toHaveBeenCalledWith({
            data: {
                name: "Pushups",
                description: null,
                muscle_group: "Chest",
                user_id: "test-user-id",
            },
        });
    });
});
