"use client";

import React from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, Loader2 } from 'lucide-react';
import { BottomDrawer, muscleColorMap } from "@/app/components/ui";
import { useMusclePerformanceData } from "../../api/query-hooks/use-muscle-performance-data";
import { MusclePerformanceData, ExercisePerformanceData } from "../../types";

// Helper component for the trend indicators with premium styling
const TrendIndicator = ({ status, label }: { status: 'up' | 'down' | 'same', label: string }) => {
    const isUp = status === 'up';
    const isDown = status === 'down';

    return (
        <div className="flex flex-col items-center justify-center space-y-1.5 group/trend">
            <div
                className={`relative flex items-center justify-center w-9 h-9 rounded-2xl transition-all duration-300 ${isUp ? 'bg-accent/15 text-accent shadow-[0_0_15px_rgba(236,72,153,0.15)] ring-1 ring-accent/30' :
                    isDown ? 'bg-muted text-muted-foreground/60 border border-border' :
                        'bg-muted/50 text-muted-foreground/40 border border-border/50'
                    }`}
            >
                {/* Glowing ring for "up" trend */}
                {isUp && <div className="absolute inset-0 rounded-2xl animate-pulse-ring pointer-events-none" />}

                {isUp && <TrendingUp size={18} strokeWidth={3} className="relative z-10" />}
                {isDown && <TrendingDown size={18} strokeWidth={2.5} className="relative z-10" />}
                {!isUp && !isDown && <Minus size={18} strokeWidth={2.5} className="relative z-10" />}
            </div>
            <span className={`text-[9px] font-black tracking-widest uppercase transition-colors duration-300 ${isUp ? 'text-accent' : 'text-muted-foreground/50'}`}>
                {label}
            </span>
        </div>
    );
};

export function MuscleOutputTable() {
    const { data: weeklyData, isLoading, error } = useMusclePerformanceData();
    const [selectedMuscle, setSelectedMuscle] = React.useState<MusclePerformanceData | null>(null);

    if (isLoading) {
        return (
            <div className="w-full bg-card rounded-3xl elevation-1 border border-border p-12 flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full animate-pulse-ring bg-accent/20" />
                    <Loader2 className="w-10 h-10 animate-spin text-accent relative z-10" />
                </div>
                <p className="text-muted-foreground font-display font-medium mt-6 tracking-wide">Analysing your output...</p>
            </div>
        );
    }

    if (error || !weeklyData) {
        return (
            <div className="w-full bg-card rounded-3xl elevation-1 border border-border p-12 text-center animate-fade-in">
                <div className="w-12 h-12 bg-danger/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Activity className="text-danger" size={24} />
                </div>
                <p className="text-foreground font-display font-bold text-lg">Analysis Interrupted</p>
                <p className="text-muted-foreground text-sm mt-1 max-w-[240px] mx-auto">We couldn&apos;t reach the performance engine. Check your connection.</p>
            </div>
        );
    }

    if (weeklyData.length === 0) {
        return (
            <div className="w-full bg-card rounded-3xl elevation-1 border border-border p-12 text-center animate-fade-in">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Activity className="text-muted-foreground/30" size={32} />
                </div>
                <p className="text-foreground font-display font-bold text-xl">No Output Tracked</p>
                <p className="text-muted-foreground text-sm mt-2 max-w-[280px] mx-auto leading-relaxed">Log your first workout to see your weekly performance insights here.</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-card rounded-3xl elevation-1 overflow-hidden border border-border animate-fade-in">

            {/* Header Section */}
            <div className="p-7 md:p-9 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-xl relative overflow-hidden">
                {/* Background decorative glow */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/10 blur-3xl rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <h1 className="text-2xl md:text-3xl font-display font-black text-foreground tracking-tight flex items-center gap-3">
                        Weekly Output
                        <div className="bg-accent/10 p-2 rounded-xl">
                            <Activity className="text-accent" size={22} strokeWidth={3} />
                        </div>
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1.5 text-sm tracking-wide">Performance & volume breakdown</p>
                </div>

                <div className="hidden md:flex items-center gap-2.5 bg-accent/10 px-5 py-2.5 rounded-2xl border border-accent/20">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-accent font-black text-[11px] tracking-[0.15em] uppercase">On Track</span>
                </div>
            </div>

            {/* Mobile View (Stacked Cards) */}
            <div className="block md:hidden p-5 space-y-4">
                {weeklyData.map((row: MusclePerformanceData, i: number) => (
                    <div
                        key={row.muscleGroup}
                        className="animate-slide-up relative bg-muted/20 border border-border/60 rounded-[28px] p-6 transition-all active:animate-press active:bg-muted/40 cursor-pointer overflow-hidden group"
                        style={{ animationDelay: `${i * 80}ms` }}
                        onClick={() => setSelectedMuscle(row)}
                    >
                        {/* Vertical Muscle Accent */}
                        <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-full ${muscleColorMap[row.muscleGroup] || 'bg-accent'} opacity-80`} />

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-display font-black text-foreground">{row.muscleGroup}</h2>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-70">Muscle Group</p>
                            </div>
                            <div className="bg-card elevation-1 border border-border/50 px-4 py-2 rounded-2xl text-center min-w-[64px]">
                                <p className="text-2xl font-display font-black text-accent">{row.currentWeekSets}</p>
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Sets</p>
                            </div>
                        </div>

                        <div className="bg-card elevation-1 border border-border/40 rounded-2xl p-4 flex justify-between items-center relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Total Volume</p>
                                <p className="text-xl font-display font-black text-foreground">
                                    {row.currentWeekVolume.toLocaleString()} <span className="text-xs text-muted-foreground font-medium lowercase">kg</span>
                                </p>
                            </div>

                            <div className="flex gap-4 relative z-10">
                                <TrendIndicator status={row.repsTrend} label="R" />
                                <TrendIndicator status={row.weightTrend} label="W" />
                                <TrendIndicator status={row.volumeTrend} label="V" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop/Tablet View (Standard Table) */}
            <div className="hidden md:block w-full">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted/10">
                            <th className="py-5 px-9 text-[11px] font-black text-muted-foreground uppercase tracking-widest border-b border-border/50">Muscle Group</th>
                            <th className="py-5 px-9 text-[11px] font-black text-muted-foreground uppercase tracking-widest border-b border-border/50 text-center">Total Sets</th>
                            <th className="py-5 px-9 text-[11px] font-black text-muted-foreground uppercase tracking-widest border-b border-border/50">Total Volume</th>
                            <th className="py-5 px-9 text-[11px] font-black text-muted-foreground uppercase tracking-widest border-b border-border/50 text-center">Performance Matrix</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {weeklyData.map((row: MusclePerformanceData, i: number) => (
                            <tr
                                key={row.muscleGroup}
                                className="group hover:bg-muted/30 transition-all duration-300 cursor-pointer animate-slide-up"
                                style={{ animationDelay: `${i * 60}ms` }}
                                onClick={() => setSelectedMuscle(row)}
                            >
                                <td className="py-7 px-9 relative">
                                    {/* Vertical accent hovered */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${muscleColorMap[row.muscleGroup] || 'bg-accent'} opacity-0 group-hover:opacity-100 transition-opacity`} />
                                    <span className="text-xl font-display font-black text-foreground">{row.muscleGroup}</span>
                                </td>
                                <td className="py-7 px-9 text-center">
                                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-muted/50 border border-border/50 group-hover:bg-accent/10 group-hover:border-accent/30 group-hover:text-accent font-display font-black text-xl transition-all duration-300">
                                        {row.currentWeekSets}
                                    </span>
                                </td>
                                <td className="py-7 px-9">
                                    <span className="text-xl font-display font-black text-foreground tracking-tight">
                                        {row.currentWeekVolume.toLocaleString()} <span className="text-xs text-muted-foreground font-medium lowercase">kg</span>
                                    </span>
                                </td>
                                <td className="py-7 px-9">
                                    <div className="flex justify-center gap-8">
                                        <TrendIndicator status={row.repsTrend} label="Reps" />
                                        <TrendIndicator status={row.weightTrend} label="Weight" />
                                        <TrendIndicator status={row.volumeTrend} label="Volume" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Bottom Drawer for Exercise Breakdown */}
            {selectedMuscle && (
                <BottomDrawer
                    isOpen={!!selectedMuscle}
                    onClose={() => setSelectedMuscle(null)}
                    title={`${selectedMuscle.muscleGroup} Breakdown`}
                    height="85vh"
                >
                    <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
                        <div className="space-y-5 mt-2">
                            {selectedMuscle.exercises.map((ex: ExercisePerformanceData, idx: number) => (
                                <div
                                    key={ex.name}
                                    className="animate-slide-up bg-muted/30 rounded-[32px] p-7 border border-border/60 shadow-sm transition-all hover:bg-muted/50 hover:border-border"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="max-w-[70%]">
                                            <h3 className="text-xl font-display font-black text-foreground leading-tight tracking-tight">{ex.name}</h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className={`w-2 h-2 rounded-full ${muscleColorMap[selectedMuscle.muscleGroup] || 'bg-accent'}`} />
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-70">Drilldown Insight</p>
                                            </div>
                                        </div>
                                        <div className="bg-accent/10 border border-accent/20 px-5 py-2.5 rounded-2xl text-center min-w-[70px]">
                                            <p className="text-3xl font-display font-black text-accent leading-none">{ex.currentWeekSets}</p>
                                            <p className="text-[10px] font-black text-accent/60 uppercase tracking-widest mt-1.5">Sets</p>
                                        </div>
                                    </div>

                                    <div className="flex items-stretch justify-between gap-5">
                                        <div className="bg-card elevation-1 border border-border/40 rounded-[24px] p-5 flex-1">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 opacity-60">Session Volume</p>
                                            <p className="text-2xl font-display font-black text-foreground tracking-tight">
                                                {ex.currentWeekVolume.toLocaleString()} <span className="text-xs text-muted-foreground font-medium lowercase">kg</span>
                                            </p>
                                        </div>

                                        <div className="flex gap-5 items-center bg-card elevation-1 border border-border/40 rounded-[24px] px-6">
                                            <TrendIndicator status={ex.repsTrend} label="R" />
                                            <TrendIndicator status={ex.weightTrend} label="W" />
                                            <TrendIndicator status={ex.volumeTrend} label="V" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </BottomDrawer>
            )}

        </div>
    );
}
