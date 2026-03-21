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
    /** Key for exercise history queries, optionally filtered by exerciseId. */
    history: (exerciseId?: string) => [...logKeys.all, "history", exerciseId].filter(Boolean),
};
