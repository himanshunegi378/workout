"use client";


import { useFatigueData } from "../../../api/query-hooks/use-fatigue-data";
import {
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Area,
    ComposedChart,
    CartesianGrid,
    Legend
} from "recharts";
import { Loader2, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { startOfDay, subDays } from "date-fns";

export function FatigueTrendLine() {
    const [startDateOffset, setStartDateOffset] = useState(0);

    // Calculate the targeted end date based on our offset (offset 0 = today, offset 90 = 90 days ago)
    const targetEndDate = startDateOffset === 0 ? undefined : subDays(startOfDay(new Date()), startDateOffset);

    // Fetch 90 days of data ending at our target date
    const { data: response, isLoading, error, isFetching } = useFatigueData(targetEndDate, 90);
    const rawData = response?.timeSeries;
    const hasMoreHistory = response?.hasMoreHistory ?? false;

    const handlePrev = () => {
        if (!hasMoreHistory) return;
        setStartDateOffset(prev => prev + 90);
    };

    const handleNext = () => {
        if (startDateOffset <= 0) return;
        setStartDateOffset(prev => Math.max(0, prev - 90));
    };

    if (isLoading && startDateOffset === 0) {
        return (
            <div className="bg-card text-card-foreground rounded-3xl p-6 border border-border elevation-1 animate-pulse min-h-[300px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
        );
    }

    if (error || !rawData) {
        return (
            <div className="bg-card text-card-foreground rounded-3xl p-6 border border-border elevation-1 min-h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Failed to load fatigue data</p>
            </div>
        );
    }

    // Format dates for the X-axis (e.g., "Feb 10")
    const data = rawData.map(d => {
        const dateObj = new Date(d.date);
        return {
            ...d,
            // Recharts needs a string or number for purely categorical XAxis
            displayDate: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        };
    });

    const isCalibrating = data.length > 0 && data[data.length - 1].isCalibrating;
    const currentRatio = data.length > 0 ? data[data.length - 1].ratio : 0;


    // Determine status color based on ratio
    let statusColor = "text-success";
    let statusText = "Optimal";

    if (currentRatio > 1.5) {
        statusColor = "text-destructive";
        statusText = "Danger (High Fatigue)";
    } else if (currentRatio >= 1.3) {
        statusColor = "text-warning"; // Tailwind amber/yellow
        statusText = "Overreaching";
    } else if (currentRatio < 0.8) {
        statusColor = "text-muted-foreground";
        statusText = "Undertraining";
    }

    return (
        <div className="bg-card text-card-foreground rounded-3xl p-6 border border-border elevation-1 hover:border-accent/30 transition-all duration-300 relative overflow-hidden group">

            {/* Header with Navigation */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-accent" />
                        Fatigue & Workload
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                        <button
                            onClick={handlePrev}
                            disabled={!hasMoreHistory || isFetching}
                            className={`p-1 rounded-md transition-colors ${!hasMoreHistory || isFetching ? 'text-muted-foreground/30 cursor-not-allowed' : 'text-foreground hover:bg-muted'}`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-xs text-muted-foreground font-medium min-w-[60px] text-center">
                            {isFetching ? "..." : (startDateOffset === 0 ? "Last 90 Days" : `${startDateOffset}d ago`)}
                        </span>
                        <button
                            onClick={handleNext}
                            disabled={startDateOffset === 0 || isFetching}
                            className={`p-1 rounded-md transition-colors ${startDateOffset === 0 || isFetching ? 'text-muted-foreground/30 cursor-not-allowed' : 'text-foreground hover:bg-muted'}`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {!isCalibrating && data.length > 0 && startDateOffset === 0 && (
                    <div className="text-right">
                        <p className={`text-2xl font-black ${statusColor}`}>
                            {currentRatio.toFixed(2)}
                        </p>
                        <p className={`text-xs font-semibold uppercase tracking-wider ${statusColor} opacity-80`}>
                            {statusText}
                        </p>
                    </div>
                )}
            </div>

            {/* Chart Container */}
            <div className="h-[220px] w-full relative">

                {/* Calibration Overlay */}
                {isCalibrating && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/80 backdrop-blur-sm rounded-xl border border-border/50">
                        <Activity className="w-8 h-8 text-accent mb-2 animate-pulse" />
                        <p className="font-bold text-lg">Calibrating...</p>
                        <p className="text-sm text-muted-foreground max-w-[200px] text-center mt-1">
                            Building your 28-day baseline before calculating fatigue.
                        </p>
                    </div>
                )}

                <div className="w-full h-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorChronic" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                            <XAxis
                                dataKey="displayDate"
                                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={20}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => Math.round(val).toString()}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    borderColor: "hsl(var(--border))",
                                    borderRadius: "12px",
                                    padding: "12px",
                                    boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.5)"
                                }}
                                itemStyle={{ fontSize: "14px", fontWeight: 500 }}
                                labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "4px", fontSize: "12px" }}
                            />
                            <Legend
                                verticalAlign="top"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}
                            />

                            {/* Chronic Load (28-day baseline) */}
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

                            {/* Acute Load (7-day spike) */}
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
            </div>
        </div>
    );
}
