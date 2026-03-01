import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editExerciseMetadata, EditExerciseMetadataData } from "../mutations";
import { workoutKeys } from "@/app/features/workouts/api/query-keys";

interface UseEditExerciseMetadataProps {
    programmeId: string;
    workoutId: string;
    metadataId: string;
}

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

