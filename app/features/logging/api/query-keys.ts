export const logKeys = {
    all: ["logs"] as const,
    lists: () => [...logKeys.all, "list"] as const,
    list: (filters: string) => [...logKeys.lists(), { filters }] as const,
    sessions: () => [...logKeys.all, "sessions"] as const,
    history: (exerciseId?: string) => [...logKeys.all, "history", exerciseId].filter(Boolean),
};
