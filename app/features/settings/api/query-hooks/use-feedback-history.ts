"use client";

import { useQuery } from "@tanstack/react-query";
import type { FeedbackStatus } from "@/app/generated/prisma";
import { feedbackKeys } from "../query-keys";

export type FeedbackListItem = {
    id: string;
    description: string;
    status: FeedbackStatus;
    created_at: string;
    updated_at: string;
};

/**
 * Fetches previously submitted feedback for the current user.
 */
export function useFeedbackHistory() {
    return useQuery({
        queryKey: feedbackKeys.lists(),
        queryFn: async (): Promise<FeedbackListItem[]> => {
            const response = await fetch("/api/feedback", {
                method: "GET",
                cache: "no-store",
            });

            const payload = (await response.json().catch(() => null)) as
                | { error?: string }
                | FeedbackListItem[]
                | null;

            if (!response.ok) {
                throw new Error(
                    payload && !Array.isArray(payload) ? payload.error || "Failed to load feedback history" : "Failed to load feedback history"
                );
            }

            return Array.isArray(payload) ? payload : [];
        },
    });
}
