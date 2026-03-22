import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editExerciseMetadata, EditExerciseMetadataData } from "../mutations";
import { workoutKeys } from "@/app/features/workouts/api/query-keys";

interface UseEditExerciseMetadataProps {
    programmeId: string;
    workoutId: string;
    metadataId: string;
}

/**
 * A custom mutation hook for updating the metadata of an exercise within a specific workout.
 * 
 * Context:
 * "Metadata" in this context refers to the intended programming for an exercise (sets, reps, rest, tempo)
 * rather than the exercise's global definition. This hook is used when a user modifies their workout plan.
 * 
 * Why:
 * - Reactive Updates: Automatically invalidates the workout detail cache upon success, 
 *   ensuring the UI immediately reflects the changes (e.g., updated rep ranges).
 * - Encapsulated Logic: Simplifies the mutation process by abstracting the API call 
 *   and cache management into a single, reusable hook.
 */
export function useEditExerciseMetadata({
    programmeId,
    workoutId,
    metadataId,
}: UseEditExerciseMetadataProps) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: EditExerciseMetadataData) =>
            editExerciseMetadata(programmeId, workoutId, metadataId, data),
        onSuccess: () => {
            // Invalidate the workout details to reflect the updated metadata
            queryClient.invalidateQueries({
                queryKey: workoutKeys.detail(workoutId),
            });
        },
    });
}

