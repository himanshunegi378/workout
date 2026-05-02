import { MuscleGroup } from "@/app/generated/prisma/client";

export type TrendStatus = 'up' | 'down' | 'same';
export type PerformanceStatus = "increase" | "decrease" | "stable";
export type MuscleChartMetric = "volume" | "avgLoad";

export type ExercisePerformanceData = {
    name: string;
    currentWeekSets: number;
    lastWeekSets: number;
    currentWeekVolume: number;
    lastWeekVolume: number;
    volumeChangePercentage: number;
    repsTrend: TrendStatus;
    weightTrend: TrendStatus;
    volumeTrend: TrendStatus;
    performance: PerformanceStatus;
    trendDetail: string;
};

export type HistoricalMuscleMetricData = {
    weekStart: string;
    label: string;
    volume: number;
    avgLoad: number | null;
    volumeTrend: number;
    avgLoadTrend: number | null;
};

export type MusclePerformanceData = {
    muscleGroup: MuscleGroup;
    currentWeekSets: number;
    lastWeekSets: number;
    currentWeekVolume: number;
    lastWeekVolume: number;
    volumeChangePercentage: number;
    repsTrend: TrendStatus;
    weightTrend: TrendStatus;
    volumeTrend: TrendStatus;
    performance: PerformanceStatus;
    trendDetail: string;
    exercises: ExercisePerformanceData[];
    historicalVolume?: HistoricalMuscleMetricData[];
};
