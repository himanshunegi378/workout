"use client";

import { useMusclePerformanceData, MusclePerformanceData } from "../../api/query-hooks/use-muscle-performance-data";
import { TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import { muscleColorMap } from "@/app/components/ui";

export function MusclePerformanceTable() {
    const { data, isLoading, error } = useMusclePerformanceData();

    if (isLoading) {
        return (
            <div className="bg-card text-card-foreground p-6 rounded-3xl border border-border flex flex-col items-center justify-center min-h-[200px] elevation-1">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">Loading performance data...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-card text-card-foreground p-6 rounded-3xl border border-border flex flex-col items-center justify-center min-h-[200px] elevation-1">
                <p className="text-sm text-danger">Failed to load performance data.</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-card text-card-foreground p-6 rounded-3xl border border-border flex flex-col items-center justify-center min-h-[200px] elevation-1">
                <p className="text-sm text-muted-foreground italic text-center">No volume data in the last 14 days.<br />Log a workout to see performance trends.</p>
            </div>
        );
    }

    return (
        <div className="bg-card text-card-foreground rounded-3xl border border-border overflow-hidden elevation-1">
            <div className="p-5 border-b border-border bg-muted/20">
                <h3 className="text-base font-display font-semibold">Muscle Performance</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Current vs. Previous Week</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase text-muted-foreground bg-muted/30 border-b border-border">
                        <tr>
                            <th className="px-5 py-3 font-medium">Muscle</th>
                            <th className="px-5 py-3 font-medium text-right">Weekly Sets</th>
                            <th className="px-5 py-3 font-medium text-right">Last Week</th>
                            <th className="px-5 py-3 font-medium">Performance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.map((row: MusclePerformanceData) => {
                            const isIncrease = row.performance === "increase";
                            const isDecrease = row.performance === "decrease";
                            const isStable = row.performance === "stable";

                            // Get visual color mapped to muscle, use accent fallback
                            const colorClass = muscleColorMap[row.muscleGroup] || "bg-accent";

                            return (
                                <tr key={row.muscleGroup} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-5 py-4 font-medium flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${colorClass}`} />
                                        {row.muscleGroup}
                                    </td>
                                    <td className="px-5 py-4 text-right font-display font-semibold">
                                        {row.currentWeekSets}
                                    </td>
                                    <td className="px-5 py-4 text-right text-muted-foreground text-xs">
                                        {row.lastWeekSets}
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-1.5">
                                            {isIncrease && <TrendingUp className="w-4 h-4 text-success" />}
                                            {isDecrease && <TrendingDown className="w-4 h-4 text-danger" />}
                                            {isStable && <Minus className="w-4 h-4 text-muted-foreground" />}
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-opacity-10 capitalize ${isIncrease ? "text-success bg-success" :
                                                isDecrease ? "text-danger bg-danger" :
                                                    "text-muted-foreground bg-muted"
                                                }`}>
                                                {row.trendDetail}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
