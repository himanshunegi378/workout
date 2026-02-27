"use client";

import { useState, useMemo } from "react";
import { PageHeader, BottomNav } from "@/app/components/ui";
import { useVolumeData } from "../api/query-hooks/use-volume-data";
import { MusclePerformanceTable } from "./ui/MusclePerformanceTable";
import { StatGrid } from "./ui/StatGrid";
import { VolumeChart } from "./ui/VolumeChart";
import { VolumeZoneLegend } from "./ui/VolumeZoneLegend";
import { VolumeInsightCard } from "./ui/VolumeInsightCard";
import { DashboardHeader } from "./ui/DashboardHeader";
import { DashboardFilters } from "./ui/DashboardFilters";
import { DashboardLoading } from "./ui/DashboardLoading";
import { DashboardEmptyState } from "./ui/DashboardEmptyState";
import { DashboardError } from "./ui/DashboardError";
import type { VolumeSessionData, DashboardFiltersState } from "../types";

export function DashboardContent() {
    const { data: volumeData, isLoading, error } = useVolumeData();
    const [filters, setFilters] = useState<DashboardFiltersState>({
        workoutId: "all",
        muscleGroup: "all",
    });

    // Extract unique options for dropdowns
    const { workouts, muscleGroups } = useMemo(() => {
        if (!volumeData) return { workouts: [], muscleGroups: [] };

        const wMap = new Map<string, string>();
        const mSet = new Set<string>();

        volumeData.forEach((point) => {
            wMap.set(point.workoutId, point.workoutName);
            mSet.add(point.muscleGroup);
        });

        return {
            workouts: Array.from(wMap.entries()).map(([id, name]) => ({ id, name })),
            muscleGroups: Array.from(mSet).sort(),
        };
    }, [volumeData]);

    // Apply filters and group by date
    const activeSessions = useMemo<VolumeSessionData[]>(() => {
        if (!volumeData) return [];

        const filtered = volumeData.filter((point) => {
            if (filters.workoutId !== "all" && point.workoutId !== filters.workoutId) return false;
            if (filters.muscleGroup !== "all" && point.muscleGroup !== filters.muscleGroup) return false;
            return true;
        });

        const sessionsMap = new Map<string, { volume: number; workouts: Set<string>; exercises: Map<string, number> }>();

        filtered.forEach((point) => {
            if (!sessionsMap.has(point.date)) {
                sessionsMap.set(point.date, { volume: 0, workouts: new Set(), exercises: new Map() });
            }
            const session = sessionsMap.get(point.date)!;
            session.volume += point.volume;
            session.workouts.add(point.workoutId);

            // Merge exercises
            point.exercises.forEach((ex: { name: string; volume: number }) => {
                const currentVol = session.exercises.get(ex.name) ?? 0;
                session.exercises.set(ex.name, currentVol + ex.volume);
            });
        });

        const sortedSessions = Array.from(sessionsMap.entries()).sort(
            (a, b) => a[0].localeCompare(b[0])
        );

        return sortedSessions.map(([date, sessionData], index) => {
            let percentChange: number | null = null;
            if (index > 0) {
                const prevVolume = sortedSessions[index - 1][1].volume;
                if (prevVolume > 0) {
                    percentChange = Number((((sessionData.volume - prevVolume) / prevVolume) * 100).toFixed(1));
                } else if (sessionData.volume > 0) {
                    percentChange = 100;
                } else {
                    percentChange = 0;
                }
            }

            // Convert exercises map to sorted array (highest volume first)
            const sortedExercises = Array.from(sessionData.exercises.entries())
                .map(([name, volume]) => ({ name, volume }))
                .sort((a, b) => b.volume - a.volume);

            return {
                date,
                volume: sessionData.volume,
                sessionCount: sessionData.workouts.size,
                percentChange,
                exercises: sortedExercises,
            };
        });
    }, [volumeData, filters]);

    if (isLoading) return <DashboardLoading />;
    if (error) return <DashboardError />;

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground pb-20">
            <PageHeader title="Dashboard" />

            <div className="flex-1 px-4 py-4 space-y-6">
                <DashboardHeader />

                {volumeData && volumeData.length > 0 ? (
                    <div className="space-y-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
                        <DashboardFilters
                            filters={filters}
                            setFilters={setFilters}
                            workouts={workouts}
                            muscleGroups={muscleGroups}
                        />

                        {activeSessions.length > 0 ? (
                            <div className="flex flex-col gap-6">
                                <MusclePerformanceTable />
                                <StatGrid data={activeSessions} />
                                <VolumeInsightCard data={activeSessions} />
                                <VolumeChart data={activeSessions} />
                                <VolumeZoneLegend />
                            </div>
                        ) : (
                            <DashboardEmptyState />
                        )}
                    </div>
                ) : (
                    <DashboardEmptyState
                        message="Log your first workout to start seeing volume insights."
                        style={{ animationDelay: '100ms' }}
                        className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground italic animate-slide-up"
                    />
                )}
            </div>
            <BottomNav />
        </div>
    );
}
