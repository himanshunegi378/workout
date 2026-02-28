"use client";

import { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    CartesianGrid
} from "recharts";
import { Loader2, TrendingUp, AlertTriangle, ArrowRight, Activity } from "lucide-react";
import { useWorkouts } from "../api/query-hooks/use-workouts";
import { useSessionVolume, type SessionVolumeNode } from "../api/query-hooks/use-session-volume";

export function SessionVolumeChart() {
    const { data: workouts, isLoading: loadingWorkouts } = useWorkouts();
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>("");

    // Auto-select the first workout when data loads if none selected
    useEffect(() => {
        if (workouts && workouts.length > 0 && !selectedWorkoutId) {
            setSelectedWorkoutId(workouts[0].id);
        }
    }, [workouts, selectedWorkoutId]);

    const { data: sessionData, isLoading: loadingVolume, isFetching } = useSessionVolume(
        selectedWorkoutId || undefined,
        15 // Fetch last 15 sessions
    );

    // Dynamic color mapping based on status
    const getColorForStatus = (status: string) => {
        switch (status) {
            case "optimal": return "#10b981"; // Emerald-500 (Green)
            case "warning": return "#f59e0b"; // Amber-500 (Yellow/Orange)
            case "deload": return "#64748b"; // Slate-500 (Gray)
            default: return "#3b82f6"; // Blue-500 (Neutral/First Session)
        }
    };

    // Format for Recharts
    const chartData = sessionData?.map(session => {
        const dateObj = new Date(session.date);
        return {
            ...session,
            displayDate: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            fillColor: getColorForStatus(session.status)
        };
    }) || [];

    const handleWorkoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWorkoutId(e.target.value);
    };

    return (
        <div className="bg-card text-card-foreground rounded-3xl p-6 border border-border elevation-1 hover:border-accent/30 transition-all duration-300 relative overflow-hidden group">

            {/* Header with Nav */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Session Progression
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        Track total volume per routine
                    </p>
                </div>

                <div className="w-full sm:w-auto flex items-center gap-2">
                    {loadingWorkouts ? (
                        <div className="h-10 w-48 bg-muted animate-pulse rounded-xl" />
                    ) : (
                        <div className="relative w-full sm:w-48">
                            <select
                                value={selectedWorkoutId}
                                onChange={handleWorkoutChange}
                                className="w-full appearance-none bg-background border border-border text-foreground text-sm rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            >
                                {workouts?.map(w => (
                                    <option key={w.id} value={w.id}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chart Area */}
            <div className="min-h-[220px] w-full relative">
                {(loadingVolume || isFetching) && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/50 backdrop-blur-sm rounded-xl">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}

                {!loadingWorkouts && workouts?.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-10">
                        <Activity className="w-8 h-8 opacity-20 mb-2" />
                        <p>No workout templates found.</p>
                    </div>
                ) : chartData.length === 0 && !loadingVolume ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-10">
                        <Activity className="w-8 h-8 opacity-20 mb-2" />
                        <p>No logged sessions found for this routine.</p>
                    </div>
                ) : (
                    <div className="w-full h-[220px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                                <XAxis
                                    dataKey="displayDate"
                                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => `${Math.round(val / 1000)}k`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload as SessionVolumeNode;
                                            return (
                                                <div className="bg-card border border-border rounded-xl p-3 shadow-xl elevation-2 text-sm max-w-[200px]">
                                                    <p className="font-semibold mb-1 text-foreground">{data.date.split('T')[0]}</p>
                                                    <div className="flex justify-between items-center gap-4 mb-2">
                                                        <span className="text-muted-foreground">Volume</span>
                                                        <span className="font-bold">{Math.round(data.volume).toLocaleString()} lbs</span>
                                                    </div>

                                                    {data.status !== "neutral" && (
                                                        <div className={`flex items-center gap-1.5 pt-2 border-t border-border/50 ${data.status === 'optimal' ? 'text-emerald-500' :
                                                            data.status === 'warning' ? 'text-amber-500' : 'text-slate-400'
                                                            }`}>
                                                            {data.status === 'warning' ? <AlertTriangle className="w-3 h-3" /> : <ArrowRight className="w-3 h-3 block -rotate-45" />}
                                                            <span className="font-medium text-xs">
                                                                {data.deltaPercentage > 0 ? '+' : ''}{data.deltaPercentage}% from prev
                                                            </span>
                                                        </div>
                                                    )}
                                                    {data.status === 'neutral' && data.volume > 0 && (
                                                        <div className="pt-2 border-t border-border/50 text-slate-400 text-xs text-center">
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

            {/* Footer Legend */}
            {chartData.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-4 border-t border-border/40 text-[10px] sm:text-xs">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></div>
                        <span className="text-muted-foreground">Optimal (0-5%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-sm bg-amber-500"></div>
                        <span className="text-muted-foreground">High Jump {'>'}5%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-sm bg-slate-500"></div>
                        <span className="text-muted-foreground">Deload {`<`}0%</span>
                    </div>
                </div>
            )}
        </div>
    );
}
