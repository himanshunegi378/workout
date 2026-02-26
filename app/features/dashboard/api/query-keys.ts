export const dashboardKeys = {
    all: ["dashboard"] as const,
    stats: () => [...dashboardKeys.all, "stats"] as const,
    charts: () => [...dashboardKeys.all, "charts"] as const,
    volume: () => [...dashboardKeys.all, "volume"] as const,
};
