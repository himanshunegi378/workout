import { expect, it, describe, vi } from "vitest";
import { GET as getWorkouts } from "@/app/api/workouts/route";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";
import { createMockRequest } from "@/tests/helpers/request-utils";

vi.mock("@/lib/auth-helpers", async (importOriginal) => {
    const actual = await importOriginal<any>();
    return {
        ...actual,
        getUserId: vi.fn(),
    };
});

describe("Workouts API", () => {
    const userId = "test-user-id";

    describe("GET /api/workouts", () => {
        it("should return workouts for the user", async () => {
            vi.mocked(getUserId).mockResolvedValue(userId);
            const mockWorkouts = [
                { id: "w1", name: "Push", programme: { name: "PPL" } },
            ];
            vi.mocked(prisma.workout.findMany).mockResolvedValue(mockWorkouts as any);

            const response = await getWorkouts();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockWorkouts);
            expect(prisma.workout.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    programme: {
                        user_id: userId
                    }
                }
            }));
        });

        it("should return 401 if unauthorized", async () => {
            vi.mocked(getUserId).mockResolvedValue(null);
            const response = await getWorkouts();
            expect(response.status).toBe(401);
        });
    });
});
