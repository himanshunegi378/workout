"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/app/components/ui";
import { useVolumeData } from "../api/query-hooks/use-volume-data";
import { VolumeOverviewCard } from "./ui/VolumeOverviewCard";
import { VolumeChart } from "./ui/VolumeChart";
import { VolumeZoneLegend } from "./ui/VolumeZoneLegend";
import { VolumeInsightCard } from "./ui/VolumeInsightCard";
import { Loader2, Activity, ChevronDown } from "lucide-react";

export function DashboardContent() {
    const { data: volumeData, isLoading, error } = useVolumeData();
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

    // Auto-select the first workout when data loads
    useEffect(() => {
        if (volumeData && volumeData.length > 0 && !selectedWorkoutId) {
            setSelectedWorkoutId(volumeData[0].workoutId);
        }
    }, [volumeData, selectedWorkoutId]);

    const activeWorkout = volumeData?.find(w => w.workoutId === selectedWorkoutId);
    const activeSessions = activeWorkout?.sessions ?? [];

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-background text-foreground pb-20">
                <PageHeader title="Dashboard" />
                <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                    <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
                </div>
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

                        {/* Workout Selector */}
                        {volumeData.length > 1 && (
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Active Program</label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none bg-card hover:bg-muted/50 transition-colors text-foreground border border-border rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent elevation-1 cursor-pointer"
                                        value={selectedWorkoutId || ""}
                                        onChange={(e) => setSelectedWorkoutId(e.target.value)}
                                    >
                                        {volumeData.map(workout => (
                                            <option key={workout.workoutId} value={workout.workoutId}>
                                                {workout.workoutName}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <VolumeInsightCard data={activeSessions} />
                        <VolumeOverviewCard data={activeSessions} />
                        <VolumeChart data={activeSessions} />
                        <VolumeZoneLegend />
                    </div>
                ) : (
                    <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground italic animate-slide-up" style={{ animationDelay: '100ms' }}>
                        Log your first workout to start seeing volume insights.
                    </div>
                )}
            </div>
        </div>
    );
}
