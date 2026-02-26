"use client";

import { useState, useMemo } from "react";
import { PageHeader, BottomNav } from "@/app/components/ui";
import { useVolumeData, VolumeSessionData } from "../api/query-hooks/use-volume-data";
import { VolumeOverviewCard } from "./ui/VolumeOverviewCard";
import { VolumeChart } from "./ui/VolumeChart";
import { VolumeZoneLegend } from "./ui/VolumeZoneLegend";
import { VolumeInsightCard } from "./ui/VolumeInsightCard";
import { Loader2, Activity, ChevronDown } from "lucide-react";

export function DashboardContent() {
    const { data: volumeData, isLoading, error } = useVolumeData();
    const [filters, setFilters] = useState<{ workoutId: string; muscleGroup: string }>({
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
            point.exercises.forEach(ex => {
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

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-background text-foreground pb-20">
                <PageHeader title="Dashboard" />
                <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                    <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
                </div>
                <BottomNav />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen bg-background text-foreground pb-20">
                <PageHeader title="Dashboard" />
                <div className="flex-1 px-4 py-6">
                    <div className="bg-danger/10 text-danger-foreground border border-danger/30 p-4 rounded-xl flex items-start gap-3">
                        <p>Failed to load dashboard data. Please try again.</p>
                    </div>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground pb-20">
            <PageHeader title="Dashboard" />

            <div className="flex-1 px-4 py-6 space-y-6">
                <div className="relative overflow-hidden p-6 rounded-3xl border border-border bg-card animate-slide-up elevation-2" style={{ animationDelay: '0ms' }}>
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-info/10 rounded-full blur-3xl animate-pulse" />
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-bold mb-1 text-foreground tracking-tight">Dashboard</h2>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Track your volume trends and stay consistent with your progressive overload.
                            </p>
                        </div>
                        <div className="bg-accent/10 p-3 rounded-2xl shadow-sm border border-accent/20">
                            <Activity className="w-6 h-6 text-accent" />
                        </div>
                    </div>
                </div>

                {volumeData && volumeData.length > 0 ? (
                    <div className="space-y-6 animate-slide-up" style={{ animationDelay: '100ms' }}>

                        {/* Filters */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Workout Selector */}
                            {workouts.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Workout</label>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none bg-card hover:bg-muted/50 transition-colors text-foreground border border-border rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent elevation-1 cursor-pointer"
                                            value={filters.workoutId}
                                            onChange={(e) => setFilters(f => ({ ...f, workoutId: e.target.value }))}
                                        >
                                            <option value="all">All Workouts</option>
                                            {workouts.map(w => (
                                                <option key={w.id} value={w.id}>
                                                    {w.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Muscle Group Selector */}
                            {muscleGroups.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Muscle</label>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none bg-card hover:bg-muted/50 transition-colors text-foreground border border-border rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent elevation-1 cursor-pointer"
                                            value={filters.muscleGroup}
                                            onChange={(e) => setFilters(f => ({ ...f, muscleGroup: e.target.value }))}
                                        >
                                            <option value="all">All Muscles</option>
                                            {muscleGroups.map(mg => (
                                                <option key={mg} value={mg}>
                                                    {mg}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {activeSessions.length > 0 ? (
                            <>
                                <VolumeInsightCard data={activeSessions} />
                                <VolumeOverviewCard data={activeSessions} />
                                <VolumeChart data={activeSessions} />
                                <VolumeZoneLegend />
                            </>
                        ) : (
                            <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground italic">
                                No volume data found for the selected filters.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground italic animate-slide-up" style={{ animationDelay: '100ms' }}>
                        Log your first workout to start seeing volume insights.
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
