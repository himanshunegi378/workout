"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { logKeys } from "../query-keys";

import type { GroupedSession, PaginatedResponse } from "../../types";

export function useInfiniteSessions({ grouped = true, limit = 10 }: { grouped?: boolean; limit?: number } = {}) {
    return useInfiniteQuery<PaginatedResponse<GroupedSession[]>>({
        queryKey: [...logKeys.sessions(), { grouped, limit }],
        queryFn: async ({ pageParam }) => {
            const url = new URL("/api/log/sessions", window.location.origin);
            if (grouped) url.searchParams.set("grouped", "true");
            url.searchParams.set("limit", limit.toString());

            if (pageParam && typeof pageParam === "string") {
                url.searchParams.set("from", pageParam);
            }

            const res = await fetch(url.toString());
            if (!res.ok) {
                throw new Error("Failed to fetch sessions");
            }
            return res.json() as Promise<PaginatedResponse<GroupedSession[]>>;
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasMore ? lastPage.pagination.to : undefined;
        },
    });
}
