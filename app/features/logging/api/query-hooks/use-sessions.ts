"use client";

import { useQuery } from "@tanstack/react-query";
import { logKeys } from "../query-keys";

export function useSessions() {
    return useQuery({
        queryKey: logKeys.sessions(),
        queryFn: async () => {
            const res = await fetch("/api/log/sessions");
            if (!res.ok) {
                throw new Error("Failed to fetch sessions");
            }
            return res.json();
        },
    });
}
