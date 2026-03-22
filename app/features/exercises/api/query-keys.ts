/**
 * A centralized factory for TanStack Query keys related to the exercises feature.
 * 
 * Context:
 * These keys are used to uniquely identify and cache queries for exercise lists and details. 
 * Using a central factory prevents "magic string" bugs and ensures consistent cache invalidation.
 */
export const exerciseKeys = {
    all: ["exercises"] as const,
    lists: () => [...exerciseKeys.all, "list"] as const,
    list: (filters: string) => [...exerciseKeys.lists(), { filters }] as const,
    details: () => [...exerciseKeys.all, "detail"] as const,
    detail: (id: string) => [...exerciseKeys.details(), id] as const,
};
