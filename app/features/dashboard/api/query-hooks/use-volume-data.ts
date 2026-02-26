import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "../query-keys";
import { MuscleGroup } from "@/app/generated/prisma/client";

export type VolumeDataPoint = {
    date: string;
    workoutId: string;
    workoutName: string;
    muscleGroup: MuscleGroup;
    volume: number;
    exercises: { name: string; volume: number }[];
};

export type VolumeSessionData = {
    date: string;
    volume: number;
    sessionCount: number;
    percentChange: number | null;
    exercises: { name: string; volume: number }[];
};

export function useVolumeData() {
    return useQuery({
        queryKey: dashboardKeys.volume(),
        queryFn: async (): Promise<VolumeDataPoint[]> => {
            const res = await fetch("/api/log/volume");
            if (!res.ok) throw new Error("Failed to fetch volume data");
            return res.json() as Promise<VolumeDataPoint[]>;
        },
    });
}
