import { useMutation, useQueryClient } from "@tanstack/react-query";
import { programmeKeys } from "../query-keys";
import { updateProgram, UpdateProgramData } from "../mutations";
import { ProgrammeSummary } from "../query-hooks/use-programmes";
import { ProgrammeDetails } from "../query-hooks/use-programme";

/**
 * A custom mutation hook for updating an existing training programme.
 * 
 * Context:
 * Used primarily for marking a programme as "Active".
 * 
 * Why:
 * - Reactive UI: Optimistically updates the programme list to reflect the active status change immediately.
 * - Single Active Logic: Backend deactivates other programmes when one is activated; the optimistic logic 
 *   mirrors this by deactivating other programmes in the cache.
 */
export function useUpdateProgramme() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProgram,
        onMutate: async (newProgramme: UpdateProgramData) => {
            // Cancel outgoing refetches so they don't overwrite our optimistic update
            await queryClient.cancelQueries({ queryKey: programmeKeys.lists() });
            await queryClient.cancelQueries({ queryKey: programmeKeys.detail(newProgramme.id) });

            // Snapshot the previous values
            const previousProgrammes = queryClient.getQueryData<ProgrammeSummary[]>(programmeKeys.lists());

            // Optimistically update the list
            if (previousProgrammes) {
                queryClient.setQueryData<ProgrammeSummary[]>(programmeKeys.lists(), (old) => {
                    if (!old) return [];
                    return old.map((p) => {
                        if (p.id === newProgramme.id) {
                            return { ...p, is_active: newProgramme.is_active };
                        }
                        // If we are activating a programme, deactivate others in the list
                        if (newProgramme.is_active) {
                            return { ...p, is_active: false };
                        }
                        return p;
                    });
                });
            }

            // Also update the specific detail query if it's currently in the cache
            queryClient.setQueryData<ProgrammeDetails | undefined>(programmeKeys.detail(newProgramme.id), (old) => {
                if (!old) return old;
                return { ...old, is_active: newProgramme.is_active };
            });

            return { previousProgrammes };
        },
        onError: (_err, _newProgramme, context) => {
            // Roll back the cache if the mutation fails
            if (context?.previousProgrammes) {
                queryClient.setQueryData(programmeKeys.lists(), context.previousProgrammes);
            }
        },
        onSettled: (_data, _error, variables) => {
            // Invalidate to sync with backend after success or failure
            if (variables) {
                queryClient.invalidateQueries({ queryKey: programmeKeys.lists() });
                queryClient.invalidateQueries({ queryKey: programmeKeys.detail(variables.id) });
            }
        },
    });
}
