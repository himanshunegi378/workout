import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "../query-keys";

export type VolumeSessionData = {
    date: string;
    volume: number;
    sessionCount: number;
    percentChange: number | null;
};

export type WorkoutVolumeData = {
    workoutId: string;
    workoutName: string;
    sessions: VolumeSessionData[];
};

export function useVolumeData() {
    return useQuery({
        queryKey: dashboardKeys.volume(),
        queryFn: async (): Promise<WorkoutVolumeData[]> => {
            const res = await fetch("/api/log/volume");
            if (!res.ok) throw new Error("Failed to fetch volume data");
            return res.json() as Promise<WorkoutVolumeData[]>;
        },
    });
}
