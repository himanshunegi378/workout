"use client";

import React from "react";
import {
    ComposedChart,
    Area,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { MuscleGroup } from "@/lib/domain-types";
import { useMuscleHistoricalMetrics } from "../../../api/query-hooks/use-muscle-historical-data";
import { Loader2, Activity } from "lucide-react";
import type { MuscleChartMetric } from "../../../types";

interface MuscleVolumeChartProps {
    muscleGroup: MuscleGroup;
}

const metricOptions: Array<{ value: MuscleChartMetric; label: string }> = [
    { value: "volume", label: "Volume" },
    { value: "avgLoad", label: "Avg load" },
];

const metricCopy: Record<MuscleChartMetric, { eyebrow: string; title: string; empty: string; unit: string }> = {
    volume: {
        eyebrow: "Volume trend (kg)",
        title: "8 week pulse",
        empty: "Log weighted sets to build a volume pulse.",
        unit: "kg",
    },
    avgLoad: {
        eyebrow: "Avg load trend",
        title: "Strength proxy",
        empty: "No weighted-load sets yet. Bodyweight work still counts in your training, but this trend needs external load.",
        unit: "kg",
    },
};

/**
 * Shows raw weekly muscle output with a smoothed trend so lifters can spot direction without overreacting to one noisy week.
 */
export const MuscleVolumeChart: React.FC<MuscleVolumeChartProps> = ({ muscleGroup }) => {
    const [metric, setMetric] = React.useState<MuscleChartMetric>("volume");
    const { data, isLoading, error } = useMuscleHistoricalMetrics(muscleGroup);

    const colors: Record<string, string> = {
        Chest: "#ff4757",
        Back: "#2ed573",
        Legs: "#ffa502",
        Shoulders: "#5352ed",
        Arms: "#eccc68",
        Abs: "#70a1ff",
    };
    const strokeColor = colors[muscleGroup] || "#5352ed";
    const trendKey = metric === "volume" ? "volumeTrend" : "avgLoadTrend";
    const copy = metricCopy[metric];
    const hasMetricData = data?.some((point) => {
        const value = point[metric];
        return value !== null && value > 0;
    }) ?? false;
    const gradientId = `color-${muscleGroup}-${metric}`;
    const formatValue = (value: number) => (
        metric === "volume" && value > 9999 ? `${(value / 1000).toFixed(1)}k` : value.toLocaleString()
    );

    if (isLoading) {
        return (
            <div className="flex h-48 w-full items-center justify-center rounded-3xl bg-background/20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/30" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-3xl bg-background/20">
                <Activity size={24} className="text-muted-foreground/40" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/70">History unavailable</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-64 w-full overflow-hidden rounded-3xl bg-background/25 p-4">
            <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/70">{copy.eyebrow}</p>
                    <p className="font-display text-xl font-semibold leading-none text-foreground">{copy.title}</p>
                    {metric === "avgLoad" ? (
                        <p className="mt-2 max-w-[260px] text-[11px] font-medium leading-5 text-foreground/65">
                            Average external load per weighted set, not a true PR strength score.
                        </p>
                    ) : null}
                </div>

                <div className="grid grid-cols-2 rounded-full bg-background/45 p-1">
                    {metricOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setMetric(option.value)}
                            className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                                metric === option.value
                                    ? "bg-accent text-white"
                                    : "text-foreground/65 hover:text-foreground"
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {metric === "avgLoad" && !hasMetricData ? (
                <div className="mt-6 flex h-40 flex-col items-center justify-center rounded-3xl bg-background/20 px-6 text-center">
                    <Activity size={24} className="text-muted-foreground/40" />
                    <p className="mt-3 font-display text-lg font-semibold tracking-tight text-foreground">Load trend waiting</p>
                    <p className="mt-2 max-w-[290px] text-xs leading-5 text-foreground/65">{copy.empty}</p>
                </div>
            ) : (
                <div className="mt-4 h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={data}
                            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.28} />
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "hsl(var(--foreground))", fontSize: 9, fontWeight: 600 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "hsl(var(--foreground))", fontSize: 9, fontWeight: 600 }}
                                tickFormatter={(value) => formatValue(Number(value))}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "none",
                                    borderRadius: "12px",
                                    backdropFilter: "blur(8px)",
                                    padding: "8px 12px",
                                }}
                                formatter={(value, name) => [
                                    `${formatValue(Number(value))} ${copy.unit}`,
                                    name === trendKey ? "3-week avg" : optionLabel(metric),
                                ]}
                                itemStyle={{ color: "hsl(var(--foreground))", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}
                                labelStyle={{ color: "hsl(var(--foreground))", fontSize: "8px", marginBottom: "4px", fontWeight: 700, textTransform: "uppercase" }}
                                cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                            />
                            <Area
                                type="monotone"
                                dataKey={metric}
                                name={optionLabel(metric)}
                                stroke={strokeColor}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill={`url(#${gradientId})`}
                                animationDuration={1500}
                            />
                            <Line
                                type="monotone"
                                dataKey={trendKey}
                                name="3-week avg"
                                stroke="hsl(var(--foreground))"
                                strokeWidth={3}
                                strokeDasharray="6 5"
                                dot={false}
                                connectNulls
                                animationDuration={1500}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

/**
 * Keeps Recharts series names aligned with the segmented control labels.
 */
function optionLabel(metric: MuscleChartMetric) {
    return metricOptions.find((option) => option.value === metric)?.label ?? metric;
}
