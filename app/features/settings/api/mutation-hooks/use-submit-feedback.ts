"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitFeedback } from "../mutations";
import { feedbackKeys } from "../query-keys";

/**
 * Submits new feedback and refreshes the cached feedback history on success.
 */
export function useSubmitFeedback() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitFeedback,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: feedbackKeys.lists() });
        },
    });
}
