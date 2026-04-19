import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { programmeKeys } from "@/app/features/programs/api/query-keys";
import { workoutKeys } from "@/app/features/workouts/api/query-keys";
import { useAddExerciseToWorkout } from "../api/mutation-hooks/use-add-exercise-to-workout";
import { useEditExerciseMetadata } from "../api/mutation-hooks/use-edit-exercise-metadata";
import { addExerciseToWorkout, editExerciseMetadata } from "../api/mutations";

vi.mock("../api/mutations", () => ({
    addExerciseToWorkout: vi.fn(),
    editExerciseMetadata: vi.fn(),
}));

/**
 * Builds an isolated React Query provider so each hook test can assert cache
 * invalidation behavior without leaking state across test cases.
 */
function createWrapper(queryClient: QueryClient) {
    return function Wrapper({ children }: PropsWithChildren) {
        return (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
    };
}

describe("exercise mutation hooks", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("invalidates both workout and programme detail queries after adding an exercise", async () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
        const invalidateQueries = vi
            .spyOn(queryClient, "invalidateQueries")
            .mockResolvedValue(undefined);
        vi.mocked(addExerciseToWorkout).mockResolvedValue({ id: "meta-1" });

        const { result } = renderHook(() => useAddExerciseToWorkout(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            await result.current.mutateAsync({
                programmeId: "prog-1",
                workoutId: "work-1",
                data: {
                    exercise_id: "exercise-1",
                    sets_min: 3,
                    sets_max: 3,
                    reps_min: 8,
                    reps_max: 10,
                    rest_min: 60,
                    rest_max: 90,
                    tempo: "2-0-2-0",
                },
            });
        });

        await waitFor(() => {
            expect(invalidateQueries).toHaveBeenCalledWith({
                queryKey: workoutKeys.detail("work-1"),
            });
            expect(invalidateQueries).toHaveBeenCalledWith({
                queryKey: programmeKeys.detail("prog-1"),
            });
        });
    });

    it("invalidates both workout and programme detail queries after editing metadata", async () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
        const invalidateQueries = vi
            .spyOn(queryClient, "invalidateQueries")
            .mockResolvedValue(undefined);
        vi.mocked(editExerciseMetadata).mockResolvedValue({ id: "meta-1" });

        const { result } = renderHook(
            () =>
                useEditExerciseMetadata({
                    programmeId: "prog-1",
                    workoutId: "work-1",
                    metadataId: "meta-1",
                }),
            {
                wrapper: createWrapper(queryClient),
            }
        );

        await act(async () => {
            await result.current.mutateAsync({ reps_min: 10 });
        });

        await waitFor(() => {
            expect(invalidateQueries).toHaveBeenCalledWith({
                queryKey: workoutKeys.detail("work-1"),
            });
            expect(invalidateQueries).toHaveBeenCalledWith({
                queryKey: programmeKeys.detail("prog-1"),
            });
        });
    });
});
