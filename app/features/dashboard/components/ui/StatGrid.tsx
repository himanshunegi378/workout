"use client";

import { Weight, Dumbbell, CalendarRange, TrendingUp } from "lucide-react";
import { VolumeSessionData } from "../../types";

interface StatGridProps {
    data: VolumeSessionData[];
}

export function StatGrid({ data }: StatGridProps) {
    if (!data.length) return null;

    const latest = data[data.length - 1];
    const recentData = data.slice(-7);
    const avgVolume = recentData.length > 0
        ? recentData.reduce((sum, d) => sum + d.volume, 0) / recentData.length
        : 0;

    const totalSessions = data.reduce((sum, d) => sum + d.sessionCount, 0);

    const stats = [
        {
            label: "Total Avg",
            value: `${(avgVolume / 1000).toFixed(1)}k`,
            unit: "kg",
            icon: <Weight className="w-5 h-5 text-accent" />,
            bgColor: "bg-accent/10 border-accent/20"
        },
        {
            label: "Last Session",
            value: `${(latest.volume / 1000).toFixed(1)}k`,
            unit: "kg",
            icon: <TrendingUp className="w-5 h-5 text-success" />,
            bgColor: "bg-success/10 border-success/20"
        },
        {
            label: "Top Muscle",
            // Just picking a dummy string for now, we'd need to extract this or rely on filters
            value: latest.exercises[0]?.name.split(' ')[0] || "Rest",
            unit: "",
            icon: <Dumbbell className="w-5 h-5 text-warning" />,
            bgColor: "bg-warning/10 border-warning/20"
        },
        {
            label: "Sessions",
            value: totalSessions.toString(),
            unit: "all time",
            icon: <CalendarRange className="w-5 h-5 text-info" />,
            bgColor: "bg-info/10 border-info/20"
        }
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
                <div
                    key={i}
                    className={`p-4 rounded-3xl border border-border elevation-1 flex flex-col justify-between h-28 ${stat.bgColor}`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                        {stat.icon}
                    </div>
                    <div className="flex items-baseline gap-1 mt-auto">
                        <span className="text-2xl font-display font-bold text-foreground">
                            {stat.value}
                        </span>
                        {stat.unit && <span className="text-xs text-muted-foreground">{stat.unit}</span>}
                    </div>
                </div>
            ))}
        </div>
    );
}
