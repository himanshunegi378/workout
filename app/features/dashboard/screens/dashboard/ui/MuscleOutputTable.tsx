"use client";

import React from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, Loader2 } from 'lucide-react';
import { BottomDrawer, muscleColorMap } from "@/app/components/ui";
import { useMusclePerformanceData } from "../../../api/query-hooks/use-muscle-performance-data";
import { MuscleVolumeChart } from "./MuscleVolumeChart";
import { MusclePerformanceData, ExercisePerformanceData, TrendStatus } from "../../../types";

/**
 * Premium Trend Badge for the reimagined grid.
 * Uses semantic background/foreground pairs and subtle glassmorphism.
 */
const TrendBadge = ({ status, label }: { status: TrendStatus, label: string }) => {
    const config = {
        up: { icon: TrendingUp, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', glow: 'shadow-[0_0_12px_rgba(0,184,148,0.2)]' },
        down: { icon: TrendingDown, color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20', glow: '' },
        same: { icon: Minus, color: 'text-muted-foreground/60', bg: 'bg-muted/30', border: 'border-border/30', glow: '' }
    }[status];

    const Icon = config.icon;

    return (
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${config.bg} ${config.border} ${config.glow} transition-all duration-500`}>
            <Icon size={10} strokeWidth={3} className={config.color} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>
                {label}
            </span>
        </div>
    );
};

/**
 * PulseCard: Optimized for extreme density in a single-row layout.
 * Maximizes vertical space by placing all key metrics on one line.
 */
const PulseCard = ({
    data,
    index,
    onClick
}: {
    data: MusclePerformanceData,
    index: number,
    onClick: () => void
}) => {
    const muscleColor = muscleColorMap[data.muscleGroup] || 'bg-accent';

    return (
        <button
            onClick={onClick}
            className="group relative flex flex-col w-full text-left bg-card/40 backdrop-blur-sm border border-border/40 rounded-xl p-3 px-4 transition-all duration-300 hover:bg-card/60 hover:border-accent/30 active:scale-[0.99] elevation-1 hover:elevation-2 animate-slide-up overflow-hidden text-foreground gap-1.5"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            {/* Minimal Background Glow */}
            <div className={`absolute -right-4 -top-4 w-16 h-16 blur-[2rem] rounded-full transition-opacity opacity-5 group-hover:opacity-10 ${muscleColor}`} />

            {/* Row 1: Muscle Label */}
            <div className="flex items-center gap-2 relative z-10 w-full border-b border-border/10 pb-1.5">
                <div className={`w-1 h-3 rounded-full ${muscleColor} opacity-70 group-hover:opacity-100 transition-opacity shrink-0`} />
                <h3 className="text-xs font-display font-black tracking-tight group-hover:text-accent transition-colors duration-200 truncate">
                    {data.muscleGroup}
                </h3>
            </div>

            {/* Row 2: Performance Metrics (Grip Aligned) */}
            <div className="grid grid-cols-[60px_70px_1fr] sm:grid-cols-[100px_120px_1fr] md:grid-cols-[140px_180px_1fr] items-center gap-2 relative z-10 w-full">
                {/* Column 1: Sets */}
                <div className="flex items-baseline gap-1 font-variant-numeric: tabular-nums">
                    <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">Sets</span>
                    <span className="text-sm font-display font-black leading-none">{data.currentWeekSets}</span>
                </div>

                {/* Column 2: Load */}
                <div className="flex flex-col border-l border-border/10 pl-2 md:pl-6 font-variant-numeric: tabular-nums">
                    <div className="flex items-baseline gap-1">
                        <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">Load</span>
                        <span className="text-sm font-display font-black leading-none">
                            {data.currentWeekVolume > 9999 ? `${(data.currentWeekVolume / 1000).toFixed(1)}k` : data.currentWeekVolume.toLocaleString()}
                            <span className="text-[8px] ml-0.5 opacity-40">kg</span>
                        </span>
                    </div>
                    {/* Volume Change % */}
                    <div className={`text-[9px] font-black uppercase tracking-tight mt-0.5 flex items-center gap-0.5 ${
                        data.volumeChangePercentage > 10 ? 'text-danger' : 
                        data.volumeChangePercentage > 5 ? 'text-warning' : 
                        data.volumeChangePercentage >= 2 ? 'text-success' : 
                        data.volumeChangePercentage > 0 ? 'text-success/70' :
                        data.volumeChangePercentage < 0 ? 'text-danger/80' : 'text-muted-foreground/40'
                    }`}>
                        {data.volumeChangePercentage > 0 ? '+' : ''}{data.volumeChangePercentage.toFixed(1)}%
                        <span className="text-[7px] opacity-40 lowercase font-bold">vol</span>
                    </div>
                </div>

                {/* Column 3: Trends */}
                <div className="flex items-center justify-end gap-1 border-l border-border/10">
                    <TrendBadge status={data.repsTrend} label="R" />
                    <TrendBadge status={data.weightTrend} label="W" />
                    <TrendBadge status={data.volumeTrend} label="Vol" />
                </div>
            </div>
        </button>
    );
};

export function MuscleOutputTable() {
    const { data: weeklyData, isLoading, error } = useMusclePerformanceData();
    const [selectedMuscle, setSelectedMuscle] = React.useState<MusclePerformanceData | null>(null);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-[240px] bg-card/20 border border-border/20 rounded-4xl animate-pulse flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/20" />
                    </div>
                ))}
            </div>
        );
    }

    if (error || !weeklyData) {
        return (
            <div className="w-full bg-card rounded-[2.5rem] elevation-2 border border-border/50 p-16 text-center animate-fade-in relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-danger/5 via-transparent to-transparent pointer-events-none" />
                <div className="w-14 h-14 bg-danger/10 border border-danger/20 rounded-[1.25rem] flex items-center justify-center mx-auto mb-6 relative z-10">
                    <Activity className="text-danger" size={28} strokeWidth={2.5} />
                </div>
                <p className="text-foreground font-display font-black text-2xl tracking-tight relative z-10">Analysis Interrupted</p>
                <p className="text-muted-foreground text-sm mt-2 max-w-[280px] mx-auto leading-relaxed relative z-10">The performance engine encountered an issue.</p>
            </div>
        );
    }

    if (weeklyData.length === 0) {
        return (
            <div className="w-full bg-card rounded-[2.5rem] elevation-2 border border-border/50 p-16 text-center animate-fade-in relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
                <div className="w-20 h-20 bg-muted/40 border border-border/50 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10">
                    <Activity className="text-muted-foreground/40" size={36} strokeWidth={2} />
                </div>
                <p className="text-foreground font-display font-black text-2xl tracking-tight relative z-10">No Output Tracked</p>
                <p className="text-muted-foreground text-sm mt-3 max-w-[320px] mx-auto leading-relaxed relative z-10">Log your first workout to unlock performance intelligence.</p>
            </div>
        );
    }

    return (
        <div className="w-full animate-fade-in">
            {/* Reimaged Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-black text-foreground tracking-tight flex items-center gap-3">
                        Performance Pulse
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                        </span>
                    </h2>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mt-2 opacity-60">
                        Real-time Biological Intelligence
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-muted/20 border border-border/30 px-5 py-2.5 rounded-full backdrop-blur-md">
                    <div className="flex -space-x-2">
                        {['Chest', 'Back', 'Legs', 'Abs', 'Shoulders'].slice(0, 3).map((m) => (
                            <div key={m} className={`w-6 h-6 rounded-full border-2 border-card ${muscleColorMap[m] || 'bg-accent'}`} />
                        ))}
                    </div>
                    <span className="text-[10px] font-black text-foreground uppercase tracking-widest whitespace-nowrap">
                        {weeklyData.length} Muscles Tracked
                    </span>
                </div>
            </div>

            {/* Performance List: Single-column high-density layout */}
            <div className="grid grid-cols-1 gap-1.5 md:gap-2">
                {weeklyData.map((row, i) => (
                    <PulseCard
                        key={row.muscleGroup}
                        data={row}
                        index={i}
                        onClick={() => setSelectedMuscle(row)}
                    />
                ))}
            </div>

            {/* Drilldown Drawer System */}
            {selectedMuscle && (
                <BottomDrawer
                    isOpen={!!selectedMuscle}
                    onClose={() => setSelectedMuscle(null)}
                    title={selectedMuscle.muscleGroup}
                    height="85vh"
                >
                    <div className="flex-1 overflow-y-auto pb-16 no-scrollbar">
                        {/* Drawer Header Detail: Reimagined Pulse Branding */}
                        <div className="mb-6 p-5 bg-card/60 backdrop-blur-xl rounded-2xl border border-border/40 relative overflow-hidden group">
                            <div className={`absolute -right-12 -top-12 w-32 h-32 blur-[4rem] rounded-full transition-opacity opacity-20 ${muscleColorMap[selectedMuscle.muscleGroup] || 'bg-accent'}`} />
                            <div className="flex justify-between items-end relative z-10">
                                <div>
                                    <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mb-1">Intelligence Report</p>
                                    <h4 className="text-3xl font-display font-black tracking-tight">{selectedMuscle.muscleGroup}</h4>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1 opacity-60">Session Volume</p>
                                    <p className="text-2xl font-display font-black leading-none">{selectedMuscle.currentWeekVolume.toLocaleString()}<span className="text-sm ml-1 opacity-40">kg</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Historical Volume Chart Integration */}
                        <div className="mb-8">
                            <MuscleVolumeChart muscleGroup={selectedMuscle.muscleGroup} />
                        </div>

                        <div className="space-y-2 px-0.5">
                            {selectedMuscle.exercises.map((ex: ExercisePerformanceData, idx: number) => (
                                <div
                                    key={ex.name}
                                    className="animate-slide-up bg-card/40 backdrop-blur-md rounded-xl p-3 px-4 border border-border/30 transition-all hover:bg-card/60 group/ex flex flex-col gap-1.5"
                                    style={{ animationDelay: `${idx * 40}ms` }}
                                >
                                    {/* Exercise Title Row */}
                                    <div className="flex items-center gap-2 relative z-10 w-full border-b border-border/10 pb-1.5">
                                        <div className={`w-1 h-3 rounded-full ${muscleColorMap[selectedMuscle.muscleGroup] || 'bg-accent'} opacity-70 group-hover/ex:opacity-100 transition-opacity shrink-0`} />
                                        <h3 className="text-xs font-display font-black tracking-tight group-hover/ex:text-accent transition-colors duration-200 truncate">
                                            {ex.name}
                                        </h3>
                                    </div>

                                    {/* Exercise Metrics Row: Grid Aligned */}
                                    <div className="grid grid-cols-[60px_80px_1fr] md:grid-cols-[100px_140px_1fr] items-center gap-2 relative z-10 w-full">
                                        <div className="flex items-baseline gap-1 font-variant-numeric: tabular-nums">
                                            <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">Sets</span>
                                            <span className="text-sm font-display font-black leading-none">{ex.currentWeekSets}</span>
                                        </div>

                                        <div className="flex flex-col border-l border-border/10 pl-2 md:pl-6 font-variant-numeric: tabular-nums">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">Load</span>
                                                <span className="text-sm font-display font-black leading-none">
                                                    {ex.currentWeekVolume > 9999 ? `${(ex.currentWeekVolume / 1000).toFixed(1)}k` : ex.currentWeekVolume.toLocaleString()}
                                                    <span className="text-[8px] ml-0.5 opacity-40">kg</span>
                                                </span>
                                            </div>
                                            <div className={`text-[9px] font-black uppercase tracking-tight mt-0.5 ${
                                                ex.volumeChangePercentage > 10 ? 'text-danger' : 
                                                ex.volumeChangePercentage > 5 ? 'text-warning' : 
                                                ex.volumeChangePercentage >= 2 ? 'text-success' : 
                                                ex.volumeChangePercentage > 0 ? 'text-success/70' :
                                                ex.volumeChangePercentage < 0 ? 'text-danger/80' : 'text-muted-foreground/40'
                                            }`}>
                                                {ex.volumeChangePercentage > 0 ? '+' : ''}{ex.volumeChangePercentage.toFixed(1)}%
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-1 border-l border-border/10">
                                            <TrendBadge status={ex.repsTrend} label="R" />
                                            <TrendBadge status={ex.weightTrend} label="W" />
                                            <TrendBadge status={ex.volumeTrend} label="Vol" />
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
