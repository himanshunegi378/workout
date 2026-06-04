"use client";

import { useState } from "react";
import { startOfDay, subDays } from "date-fns";
import {
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Area,
    ComposedChart,
    CartesianGrid,
    Legend,
} from "recharts";
import { Loader2, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { useFatigueData } from "../../../api/query-hooks/use-fatigue-data";

export function FatigueTrendLine() {
    const [startDateOffset, setStartDateOffset] = useState(0);

    const targetEndDate = startDateOffset === 0 ? undefined : subDays(startOfDay(new Date()), startDateOffset);
    const { data: response, isLoading, error, isFetching } = useFatigueData(targetEndDate, 90);
    const rawData = response?.timeSeries;
    const hasMoreHistory = response?.hasMoreHistory ?? false;

    const handlePrev = () => {
        if (!hasMoreHistory) return;
        setStartDateOffset((prev) => prev + 90);
    };

    const handleNext = () => {
        if (startDateOffset <= 0) return;
        setStartDateOffset((prev) => Math.max(0, prev - 90));
    };

    const shellClassName = "pb-6";

    const data = rawData?.map((d) => {
        const dateObj = new Date(d.date);
        return {
            ...d,
            displayDate: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        };
    }) ?? [];

    const isCalibrating = data.length > 0 && data[data.length - 1].isCalibrating;
    const currentRatio = data.length > 0 ? data[data.length - 1].ratio : 0;

    let statusColor = "text-success";
    let statusText = "Optimal";

    if (currentRatio > 1.5) {
        statusColor = "text-danger";
        statusText = "Danger";
    } else if (currentRatio >= 1.3) {
        statusColor = "text-warning";
        statusText = "Overreaching";
    } else if (currentRatio < 0.8) {
        statusColor = "text-foreground/75";
        statusText = "Undertraining";
    }

    return (
        <section className={shellClassName}>
            <div className="flex flex-col gap-4 pb-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Load balance</p>
                    <h3 className="mt-2 flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-foreground">
                        <Activity className="h-5 w-5 text-accent" />
                        Fatigue and workload
                    </h3>
                    <div className="mt-3 flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={handlePrev}
                            disabled={!hasMoreHistory || isFetching}
                            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                                !hasMoreHistory || isFetching
                                    ? "cursor-not-allowed text-muted-foreground/30"
                                    : "bg-background/45 text-foreground hover:bg-muted/30"
                            }`}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="flex-1 text-center text-xs font-medium text-foreground/75 sm:min-w-[92px] sm:flex-none">
                            {isFetching ? "Loading..." : (startDateOffset === 0 ? "Last 90 days" : `${startDateOffset} days back`)}
                        </span>
                        <button
                            onClick={handleNext}
                            disabled={startDateOffset === 0 || isFetching}
                            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                                startDateOffset === 0 || isFetching
                                    ? "cursor-not-allowed text-muted-foreground/30"
                                    : "bg-background/45 text-foreground hover:bg-muted/30"
                            }`}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {!isCalibrating && data.length > 0 && startDateOffset === 0 && (
                    <div className="flex flex-wrap items-baseline gap-2 md:justify-end">
                        <p className={`font-display text-3xl font-semibold tracking-tight ${statusColor}`}>
                            {currentRatio.toFixed(2)}
                        </p>
                        <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${statusColor}`}>
                            {statusText}
                        </p>
                    </div>
                )}
            </div>

            {isLoading && startDateOffset === 0 ? (
                <div className="flex min-h-[260px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
            ) : error || !rawData ? (
                <div className="flex min-h-[260px] items-center justify-center text-sm text-muted-foreground">
                    Failed to load fatigue data
                </div>
            ) : (
                <div className="relative mt-5 h-[240px] w-full">
                    {isCalibrating && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/70 px-6 text-center backdrop-blur-sm">
                            <Activity className="mb-2 h-8 w-8 animate-pulse text-accent" />
                            <p className="font-display text-lg font-semibold tracking-tight text-foreground">Calibrating</p>
                            <p className="mt-2 max-w-[220px] text-sm leading-6 text-foreground/75">
                                Building your 28-day baseline before calculating fatigue.
                            </p>
                        </div>
                    )}

                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 8, right: 0, left: -16, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorChronic" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.35} />
                            <XAxis
                                dataKey="displayDate"
                                tick={{ fontSize: 10, fill: "hsl(var(--foreground))" }}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={20}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: "hsl(var(--foreground))" }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => Math.round(val).toString()}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "none",
                                    borderRadius: "12px",
                                    padding: "12px",
                                    boxShadow: "none",
                                }}
                                itemStyle={{ fontSize: "14px", fontWeight: 500 }}
                                labelStyle={{ color: "hsl(var(--foreground))", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}
                            />
                            <Legend
                                verticalAlign="top"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{ fontSize: "12px", color: "hsl(var(--foreground))" }}
                            />

                            <Area
                                type="monotone"
                                dataKey="chronicLoad"
                                name="Chronic (28d Avg)"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                                fillOpacity={1}
                                fill="url(#colorChronic)"
                            />

                            <Line
                                type="monotone"
                                dataKey="acuteLoad"
                                name="Acute (7d Avg)"
                                stroke="#14b8a6"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6, strokeWidth: 0, fill: "#14b8a6" }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    );
}
