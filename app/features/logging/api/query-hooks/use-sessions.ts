"use client";

import { useQuery } from "@tanstack/react-query";
import { logKeys } from "../query-keys";
import { getSessions } from "../queries";

export function useSessions() {
    return useQuery({
        queryKey: logKeys.sessions(),
        queryFn: () => getSessions(),
    });
}
