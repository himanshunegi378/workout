"use client";

import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { MuscleGroup } from "@/app/generated/prisma/client";
import { useMuscleHistoricalVolume } from "../../../api/query-hooks/use-muscle-historical-data";
import { Loader2, Activity } from "lucide-react";

interface MuscleVolumeChartProps {
    muscleGroup: MuscleGroup;
}

export const MuscleVolumeChart: React.FC<MuscleVolumeChartProps> = ({ muscleGroup }) => {
    const { data, isLoading, error } = useMuscleHistoricalVolume(muscleGroup);

    const colors: Record<string, string> = {
        Chest: "#ff4757",
        Back: "#2ed573",
        Legs: "#ffa502",
        Shoulders: "#5352ed",
        Arms: "#eccc68",
        Abs: "#70a1ff",
    };
    const strokeColor = colors[muscleGroup] || "#5352ed";

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
        <div className="relative h-56 w-full overflow-hidden rounded-3xl bg-background/25 p-4">
            <div className="absolute left-4 top-4 z-10">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/70">Volume trend (kg)</p>
                <p className="font-display text-xl font-semibold leading-none text-foreground">8 week pulse</p>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 60, right: 0, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
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
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "none",
                            borderRadius: "12px",
                            backdropFilter: "blur(8px)",
                            padding: "8px 12px",
                        }}
                        itemStyle={{ color: "hsl(var(--foreground))", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}
                        labelStyle={{ color: "hsl(var(--foreground))", fontSize: "8px", marginBottom: "4px", fontWeight: 700, textTransform: "uppercase" }}
                        cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="volume"
                        stroke={strokeColor}
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorVolume)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
