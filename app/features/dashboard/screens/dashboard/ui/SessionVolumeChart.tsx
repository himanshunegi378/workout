"use client";

import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    CartesianGrid,
} from "recharts";
import { Loader2, TrendingUp, AlertTriangle, ArrowRight, Activity } from "lucide-react";
import { useWorkouts } from "../../../api/query-hooks/use-workouts";
import { useSessionVolume, type SessionVolumeNode } from "../../../api/query-hooks/use-session-volume";
import { useProgrammes } from "../../../../programs/api/query-hooks/use-programmes";

export function SessionVolumeChart() {
    const { data: workouts, isLoading: loadingWorkouts } = useWorkouts(true);
    const { data: programmes, isLoading: loadingProgrammes } = useProgrammes();
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>("");

    const hasActiveProgramme = programmes?.some((p) => p.is_active) ?? false;

    const effectiveWorkoutId = selectedWorkoutId || workouts?.[0]?.id || "";

    const { data: sessionData, isLoading: loadingVolume, isFetching } = useSessionVolume(
        effectiveWorkoutId || undefined,
        15
    );

    const getColorForStatus = (status: string) => {
        switch (status) {
            case "optimal":
                return "#10b981";
            case "warning":
                return "#f59e0b";
            case "deload":
                return "#64748b";
            default:
                return "#3b82f6";
        }
    };

    const chartData = sessionData?.map((session) => {
        const dateObj = new Date(session.date);
        return {
            ...session,
            displayDate: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            fillColor: getColorForStatus(session.status),
        };
    }) || [];

    const handleWorkoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWorkoutId(e.target.value);
    };

    return (
        <section className="pb-6 text-card-foreground">
                <div className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Routine volume</p>
                    <h3 className="mt-2 flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-foreground">
                        <TrendingUp className="h-5 w-5 text-accent" />
                        Session progression
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                        Track total volume per routine without leaving the surface.
                    </p>
                </div>

                <div className="w-full sm:w-auto">
                    {loadingWorkouts || loadingProgrammes ? (
                        <div className="h-10 w-full rounded-full bg-muted/40 sm:w-48" />
                    ) : (
                        hasActiveProgramme && (
                            <div className="relative w-full sm:w-52">
                                <select
                                    value={effectiveWorkoutId}
                                    onChange={handleWorkoutChange}
                                    className="w-full appearance-none rounded-full bg-background/50 px-4 py-2.5 pr-9 text-sm text-foreground transition-colors focus:outline-none focus:ring-0"
                                >
                                    {workouts?.map((w) => (
                                        <option key={w.id} value={w.id}>
                                            {w.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            <div className="relative mt-5 min-h-[220px] w-full">
                {(loadingVolume || isFetching) && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    </div>
                )}

                {!loadingWorkouts && workouts?.length === 0 && hasActiveProgramme ? (
                    <div className="flex min-h-[220px] flex-col items-center justify-center text-muted-foreground">
                        <Activity className="mb-2 h-8 w-8 opacity-20" />
                        <p className="text-sm text-foreground/75">No workout templates found.</p>
                    </div>
                ) : chartData.length === 0 && !loadingVolume && hasActiveProgramme ? (
                    <div className="flex min-h-[220px] flex-col items-center justify-center text-muted-foreground">
                        <Activity className="mb-2 h-8 w-8 opacity-20" />
                        <p className="text-sm text-foreground/75">No logged sessions found for this routine.</p>
                    </div>
                ) : (
                    <div className="w-full h-[220px] relative">
                        {!hasActiveProgramme && !loadingProgrammes && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/70 px-6 text-center backdrop-blur-sm">
                                <Activity className="mb-2 h-8 w-8 animate-pulse text-accent" />
                                <p className="font-display text-lg font-semibold tracking-tight text-foreground">No Active Programme</p>
                                <p className="mt-2 max-w-55 text-sm leading-6 text-foreground/75">
                                    Activate your training protocol in the programmes tab to see session progression.
                                </p>
                            </div>
                        )}
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.35} />
                                <XAxis
                                    dataKey="displayDate"
                                    tick={{ fontSize: 10, fill: "hsl(var(--foreground))" }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: "hsl(var(--foreground))" }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => `${Math.round(val / 1000)}k`}
                                />
                                <Tooltip
                                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload as SessionVolumeNode;
                                            return (
                                                <div className="max-w-[200px] rounded-xl bg-card p-3 text-sm">
                                                    <p className="mb-1 font-semibold text-foreground">{data.date.split("T")[0]}</p>
                                                    <div className="mb-2 flex items-center justify-between gap-4">
                                                        <span className="text-foreground/75">Volume</span>
                                                        <span className="font-bold">{Math.round(data.volume).toLocaleString()} lbs</span>
                                                    </div>

                                                    {data.status !== "neutral" && (
                                                        <div
                                                            className={`flex items-center gap-1.5 pt-2 ${
                                                                data.status === "optimal"
                                                                    ? "text-emerald-500"
                                                                    : data.status === "warning"
                                                                        ? "text-amber-500"
                                                                        : "text-slate-400"
                                                            }`}
                                                        >
                                                            {data.status === "warning" ? (
                                                                <AlertTriangle className="h-3 w-3" />
                                                            ) : (
                                                                <ArrowRight className="block h-3 w-3 -rotate-45" />
                                                            )}
                                                            <span className="text-xs font-medium">
                                                                {data.deltaPercentage > 0 ? "+" : ""}{data.deltaPercentage}% from prev
                                                            </span>
                                                        </div>
                                                    )}
                                                    {data.status === "neutral" && data.volume > 0 && (
                                                        <div className="pt-2 text-center text-xs text-foreground/65">
                                                            Baseline (First Session)
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar
                                    dataKey="volume"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={40}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fillColor} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {chartData.length > 0 && (
                <div className="mt-5 grid gap-2 pt-4 text-[10px] sm:flex sm:flex-wrap sm:items-center sm:gap-4 sm:text-xs">
                    <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        <span className="text-foreground/75">Optimal (0-5%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                        <span className="text-foreground/75">High jump {'>'}5%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-slate-500" />
                        <span className="text-foreground/75">Deload {`<`}0%</span>
                    </div>
                </div>
            )}
        </section>
    );
}
