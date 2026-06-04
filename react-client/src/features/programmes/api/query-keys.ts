/**
 * A centralized factory for TanStack Query keys related to the programmes feature.
 * 
 * Context:
 * These keys manage caching and invalidation for everything programme-related, 
 * including top-level lists and specific programme structures. 
 * 
 * Why:
 * - Robust Invalidation: Provides a single source of truth for query keys, 
 *   ensuring that creating or editing a programme updates the list across the entire app.
 */
export const programmeKeys = {
    all: ["programmes"] as const,
    lists: () => [...programmeKeys.all, "list"] as const,
    list: (filters: string) => [...programmeKeys.lists(), { filters }] as const,
    details: () => [...programmeKeys.all, "detail"] as const,
    detail: (id: string) => [...programmeKeys.details(), id] as const,
};
