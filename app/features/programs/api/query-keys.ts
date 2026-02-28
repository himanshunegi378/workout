export const programmeKeys = {
    all: ["programmes"] as const,
    lists: () => [...programmeKeys.all, "list"] as const,
    list: (filters: string) => [...programmeKeys.lists(), { filters }] as const,
    details: () => [...programmeKeys.all, "detail"] as const,
    detail: (id: string) => [...programmeKeys.details(), id] as const,
};
