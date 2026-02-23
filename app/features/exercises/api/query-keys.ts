export const exerciseKeys = {
    all: ["exercises"] as const,
    lists: () => [...exerciseKeys.all, "list"] as const,
    list: (filters: string) => [...exerciseKeys.lists(), { filters }] as const,
    details: () => [...exerciseKeys.all, "detail"] as const,
    detail: (id: string) => [...exerciseKeys.details(), id] as const,
};
