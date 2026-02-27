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

export type DashboardFiltersState = {
    workoutId: string;
    muscleGroup: string;
};
