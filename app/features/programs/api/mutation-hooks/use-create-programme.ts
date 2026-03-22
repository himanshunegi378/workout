import { useMutation, useQueryClient } from "@tanstack/react-query";
import { programmeKeys } from "../query-keys";
import { createProgram } from "../mutations";

/**
 * A custom mutation hook for creating a new training programme.
 * 
 * Context:
 * "Programmes" represent an overarching training cycle (e.g., "Max Muscle 12-Week"). 
 * This hook manages the creation process and initial persistence.
 * 
 * Why:
 * - Reactive UI: Upon successful creation, it triggers a background refresh 
 *   of all programme lists to show the new entry immediately.
 * - Centralized Lifecycle: Handles loading and error states for the 
 *   `AddProgrammeForm`.
 */
export function useCreateProgramme() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProgram,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: programmeKeys.lists() });
        },
    });
}

