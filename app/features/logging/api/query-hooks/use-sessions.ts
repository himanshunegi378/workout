"use client";

import { useQuery } from "@tanstack/react-query";
import { logKeys } from "../query-keys";

import type { GroupedSession } from "../../types";

export function useSessions({ grouped = true }: { grouped?: boolean } = {}) {
    return useQuery<GroupedSession[]>({
        queryKey: logKeys.sessions(),
        queryFn: async () => {
            const url = new URL("/api/log/sessions", window.location.origin);
            if (grouped) url.searchParams.set("grouped", "true");

            const res = await fetch(url.toString());
            if (!res.ok) {
                throw new Error("Failed to fetch sessions");
            }
            return res.json();
        },
    });
}
