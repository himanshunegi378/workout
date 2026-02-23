export const logKeys = {
    all: ["logs"] as const,
    lists: () => [...logKeys.all, "list"] as const,
    list: (filters: string) => [...logKeys.lists(), { filters }] as const,
};
