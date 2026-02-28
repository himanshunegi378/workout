import { useMutation, useQueryClient } from "@tanstack/react-query";
import { programmeKeys } from "../query-keys";
import { createProgram } from "../mutations";

export function useCreateProgramme() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProgram,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: programmeKeys.lists() });
        },
    });
}

