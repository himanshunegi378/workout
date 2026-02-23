import { useMutation, useQueryClient } from "@tanstack/react-query";
import { programKeys } from "../query-keys";
import { createProgram } from "../mutations";

export function useCreateProgram() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProgram,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: programKeys.lists() });
        },
    });
}

