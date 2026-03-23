"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus, Activity, Loader2 } from "lucide-react";
import { BottomDrawer, muscleColorMap } from "@/app/components/ui";
import { useMusclePerformanceData } from "../../../api/query-hooks/use-muscle-performance-data";
import { MuscleVolumeChart } from "./MuscleVolumeChart";
import { MusclePerformanceData, ExercisePerformanceData, TrendStatus } from "../../../types";

const TrendBadge = ({ status, label }: { status: TrendStatus; label: string }) => {
    const config = {
        up: { icon: TrendingUp, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
        down: { icon: TrendingDown, color: "text-danger", bg: "bg-danger/10", border: "border-danger/20" },
        same: { icon: Minus, color: "text-foreground/70", bg: "bg-background/40", border: "border-border/60" },
    }[status];

    const Icon = config.icon;

    return (
        <div className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 ${config.bg} ${config.border} transition-colors duration-300`}>
            <Icon size={10} strokeWidth={3} className={config.color} />
            <span className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${config.color}`}>{label}</span>
        </div>
    );
};

const MetricBlock = ({
    label,
    value,
    tone = "default",
    subtle,
}: {
    label: string;
    value: React.ReactNode;
    tone?: "default" | "muted";
    subtle?: React.ReactNode;
}) => (
    <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/70">{label}</p>
        <div className={`font-display text-2xl font-semibold leading-none tabular-nums ${tone === "muted" ? "text-muted-foreground" : "text-foreground"}`}>
            {value}
        </div>
        {subtle ? <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/70">{subtle}</p> : null}
    </div>
);

const PulseCard = ({
    data,
    index,
    onClick,
}: {
    data: MusclePerformanceData;
    index: number;
    onClick: () => void;
}) => {
    const muscleColor = muscleColorMap[data.muscleGroup] || "bg-accent";

    return (
        <button
            onClick={onClick}
            className="group flex w-full items-start gap-4 rounded-[1.5rem] border border-border/50 bg-background/35 px-4 py-4 text-left text-foreground transition-colors duration-300 hover:border-border/80 hover:bg-background/55 active:scale-[0.99] animate-slide-up"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className={`mt-1 h-10 w-1 shrink-0 rounded-full ${muscleColor} opacity-70 transition-opacity group-hover:opacity-100`} />
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/70">Muscle group</p>
                        <h3 className="mt-2 truncate font-display text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
                            {data.muscleGroup}
                        </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                        <TrendBadge status={data.repsTrend} label="R" />
                        <TrendBadge status={data.weightTrend} label="W" />
                        <TrendBadge status={data.volumeTrend} label="Vol" />
                    </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end sm:gap-4">
                    <div className="grid grid-cols-2 gap-3 sm:contents">
                        <MetricBlock
                            label="Sets"
                            value={data.currentWeekSets}
                        />
                        <div className="space-y-1 border-l border-border/50 pl-3 sm:pl-4">
                            <MetricBlock
                                label="Load"
                                value={
                                    <>
                                        {data.currentWeekVolume > 9999
                                            ? `${(data.currentWeekVolume / 1000).toFixed(1)}k`
                                            : data.currentWeekVolume.toLocaleString()}
                                        <span className="ml-1 text-xs text-muted-foreground">kg</span>
                                    </>
                                }
                                subtle={
                                    <span
                                        className={`${
                                            data.volumeChangePercentage > 10
                                                ? "text-danger"
                                                : data.volumeChangePercentage > 5
                                                    ? "text-warning"
                                                    : data.volumeChangePercentage >= 2
                                                        ? "text-success"
                                                        : data.volumeChangePercentage > 0
                                                            ? "text-success/70"
                                                            : data.volumeChangePercentage < 0
                                                                ? "text-danger/80"
                                                                : "text-muted-foreground/40"
                                        }`}
                                    >
                                        {data.volumeChangePercentage > 0 ? "+" : ""}
                                        {data.volumeChangePercentage.toFixed(1)}% volume
                                    </span>
                                }
                            />
                        </div>
                    </div>
                    <div className="justify-self-start sm:justify-self-end">
                        <div className={`h-2.5 w-16 rounded-full ${muscleColor} opacity-45`} />
                    </div>
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
            <div className="grid gap-3 lg:grid-cols-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex h-[120px] items-center gap-4 border-b border-border/50 px-4 py-4 animate-pulse">
                        <div className="h-10 w-1 rounded-full bg-muted/40" />
                        <div className="flex-1 space-y-3">
                            <div className="h-4 w-32 rounded-full bg-muted/50" />
                            <div className="h-4 w-3/4 rounded-full bg-muted/35" />
                        </div>
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/20" />
                    </div>
                ))}
            </div>
        );
    }

    if (error || !weeklyData) {
        return (
            <div className="border-b border-border/50 px-6 py-12 text-center animate-fade-in">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
                    <Activity size={24} strokeWidth={2.5} />
                </div>
                <p className="font-display text-2xl font-semibold tracking-tight text-foreground">Analysis interrupted</p>
                <p className="mx-auto mt-2 max-w-[320px] text-sm leading-6 text-muted-foreground">
                    The performance engine encountered an issue.
                </p>
            </div>
        );
    }

    if (weeklyData.length === 0) {
        return (
            <div className="border-b border-border/50 px-6 py-12 text-center animate-fade-in">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
                    <Activity className="h-6 w-6" />
                </div>
                <p className="font-display text-2xl font-semibold tracking-tight text-foreground">No muscle data yet</p>
                <p className="mx-auto mt-2 max-w-[320px] text-sm leading-6 text-muted-foreground">
                    Log a few sessions to see your volume pulse.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-5 pb-6">
            <div className="flex flex-col gap-3 border-b border-border/50 pb-4 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Muscle balance</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">Performance pulse</h2>
                    <p className="mt-2 text-sm leading-6 text-foreground/75">
                        Real-time workload balance across the muscle groups you train most.
                    </p>
                </div>

                <div className="flex items-center gap-3 rounded-full border border-border/60 bg-background/50 px-4 py-2">
                    <div className="flex -space-x-2">
                        {["Chest", "Back", "Legs"].map((m) => (
                            <div key={m} className={`h-6 w-6 rounded-full border-2 border-background ${muscleColorMap[m] || "bg-accent"}`} />
                        ))}
                    </div>
                    <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/75">
                        {weeklyData.length} muscles tracked
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {weeklyData.map((row, i) => (
                    <PulseCard
                        key={row.muscleGroup}
                        data={row}
                        index={i}
                        onClick={() => setSelectedMuscle(row)}
                    />
                ))}
            </div>

            {selectedMuscle && (
                <BottomDrawer
                    isOpen={!!selectedMuscle}
                    onClose={() => setSelectedMuscle(null)}
                    title={selectedMuscle.muscleGroup}
                    height="85vh"
                >
                    <div className="flex-1 overflow-y-auto pb-16 no-scrollbar">
                        <div className="mb-6 border-b border-border/50 pb-5">
                            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Intelligence report</p>
                                    <h4 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
                                        {selectedMuscle.muscleGroup}
                                    </h4>
                                </div>
                                <div className="text-left md:text-right">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Session volume</p>
                                    <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                                        {selectedMuscle.currentWeekVolume.toLocaleString()}
                                        <span className="ml-1 text-sm text-muted-foreground">kg</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <MuscleVolumeChart muscleGroup={selectedMuscle.muscleGroup} />
                        </div>

                        <div className="space-y-3">
                            {selectedMuscle.exercises.map((ex: ExercisePerformanceData, idx: number) => (
                                <div
                                    key={ex.name}
                                    className="animate-slide-up border-b border-border/30 py-4 transition-colors hover:border-border/50"
                                    style={{ animationDelay: `${idx * 40}ms` }}
                                >
                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Exercise</p>
                                            <h3 className="mt-2 truncate font-display text-lg font-semibold tracking-tight text-foreground">
                                                {ex.name}
                                            </h3>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <TrendBadge status={ex.repsTrend} label="R" />
                                            <TrendBadge status={ex.weightTrend} label="W" />
                                            <TrendBadge status={ex.volumeTrend} label="Vol" />
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end sm:gap-4">
                                        <div className="grid grid-cols-2 gap-3 sm:contents">
                                            <MetricBlock label="Sets" value={ex.currentWeekSets} />

                                            <div className="space-y-1 border-l border-border/50 pl-3 sm:pl-4">
                                                <MetricBlock
                                                    label="Load"
                                                    value={
                                                        <>
                                                            {ex.currentWeekVolume > 9999
                                                                ? `${(ex.currentWeekVolume / 1000).toFixed(1)}k`
                                                                : ex.currentWeekVolume.toLocaleString()}
                                                            <span className="ml-1 text-xs text-muted-foreground">kg</span>
                                                        </>
                                                    }
                                                    subtle={
                                                        <span
                                                            className={`${
                                                                ex.volumeChangePercentage > 10
                                                                    ? "text-danger"
                                                                    : ex.volumeChangePercentage > 5
                                                                        ? "text-warning"
                                                                        : ex.volumeChangePercentage >= 2
                                                                            ? "text-success"
                                                                            : ex.volumeChangePercentage > 0
                                                                                ? "text-success/70"
                                                                                : ex.volumeChangePercentage < 0
                                                                                    ? "text-danger/80"
                                                                                    : "text-muted-foreground/40"
                                                            }`}
                                                        >
                                                            {ex.volumeChangePercentage > 0 ? "+" : ""}
                                                            {ex.volumeChangePercentage.toFixed(1)}% volume
                                                        </span>
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="justify-self-start sm:justify-self-end">
                                            <div className={`h-2.5 w-16 rounded-full ${muscleColorMap[selectedMuscle.muscleGroup] || "bg-accent"} opacity-45`} />
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
