/**
 * Canonicalizes history IDs so single-ID and array callers share cache entries.
 */
function normalizeHistoryIds(exerciseId?: string | string[]) {
    return [...new Set((Array.isArray(exerciseId) ? exerciseId : [exerciseId])
        .filter((id): id is string => Boolean(id)))]
        .sort();
}

/**
 * Query key factory for logging-related queries.
 * Provides a centralized and consistent way to manage query keys for React Query.
 */
export const logKeys = {
    /** Root key for all log-related queries. */
    all: ["logs"] as const,
    /** Base key for list-based log queries. */
    lists: () => [...logKeys.all, "list"] as const,
    /** Key for a specific filtered list of logs. */
    list: (filters: string) => [...logKeys.lists(), { filters }] as const,
    /** Key for session-based log queries. */
    sessions: () => [...logKeys.all, "sessions"] as const,
    /** Key for exercise history queries, optionally filtered by exercise IDs. */
    history: (exerciseId?: string | string[]) => [...logKeys.all, "history", normalizeHistoryIds(exerciseId)] as const,
    /** Key for the most recent log of a specific exercise. */
    lastLog: (exerciseId?: string) => [...logKeys.all, "last-log", exerciseId].filter(Boolean),
};
