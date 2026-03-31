"use client";

import React, { useMemo, useRef, useState, useEffect, useLayoutEffect } from "react";
import {
    format,
    subDays,
    startOfToday,
    eachDayOfInterval,
    startOfWeek,
    parseISO,
    isSameMonth
} from "date-fns";
import { useHeatmapActivity } from "../hooks/useHeatmapData";
import { Info } from "lucide-react";
import { Portal } from "@/app/components/ui/Portal";


export function WorkoutHeatmap() {
    const { data: activity = [], isLoading } = useHeatmapActivity();
    const [hovered, setHovered] = React.useState<{ date: Date; count: number; rect: DOMRect } | null>(null);
    const dateString = useMemo(() => {
        return new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    }, []);
    const containerRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [labelWidth, setLabelWidth] = useState<number>(32); // Default estimate

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width);
            }
        });

        observer.observe(containerRef.current);

        // Initial measurement
        setContainerWidth(containerRef.current.clientWidth);
        if (labelRef.current) {
            setLabelWidth(labelRef.current.offsetWidth);
        }

        return () => observer.disconnect();
    }, []);

    const daysToShow = useMemo(() => {
        if (containerWidth <= 0) return 90; // Fallback for initial load

        // Safety buffer of 4px to prevent sub-pixel overflow or border issues
        const buffer = 4;
        const availableForWeeks = containerWidth - labelWidth - buffer;

        // Each week is 10px (w-2.5) + 2px (gap-0.5)
        // With 'gap-0.5' on the container, N columns results in N gaps 
        // (one between label and first column, and N-1 between columns)
        // Total width = labelWidth + 10N + 2N = labelWidth + 12N
        const numWeeks = Math.floor(availableForWeeks / 12);

        return Math.max(numWeeks * 7, 7);
    }, [containerWidth, labelWidth]);

    const { endDate, gridStart } = useMemo(() => {
        const end = startOfToday();
        const start = subDays(end, daysToShow);
        const grid = startOfWeek(start);
        return { endDate: end, gridStart: grid };
    }, [daysToShow]);

    const allDays = useMemo(() => {
        return eachDayOfInterval({ start: gridStart, end: endDate });
    }, [gridStart, endDate]);

    if (isLoading) {
        return (
            <div className="w-full h-48 bg-muted animate-pulse rounded-xl flex items-center justify-center">
                <span className="text-muted-foreground text-sm font-medium">Crunching workout data...</span>
            </div>
        );
    }

    // Map activity data to a Date lookup for quick access
    const activityMap = new Map<string, number>();
    activity.forEach((item) => {
        const dateStr = format(parseISO(item.date), "yyyy-MM-dd");
        activityMap.set(dateStr, item.count);
    });

    const getIntensity = (count: number) => {
        if (count === 0) return "bg-muted/50";
        if (count < 3) return "bg-pink-900/40";
        if (count < 5) return "bg-pink-700/60";
        if (count < 8) return "bg-accent/80";
        return "bg-accent";
    };

    // Group days into weeks for column layout
    const weeks: Date[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
        weeks.push(allDays.slice(i, i + 7));
    }

    const handleMouseEnter = (day: Date, count: number, e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHovered({ date: day, count, rect });
    };

    return (
        <div className="p-6 bg-card border border-border rounded-2xl elevation-3 group transition-all duration-300 hover:shadow-accent/5">
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-0.5" suppressHydrationWarning>
                    <h3 className="text-lg font-semibold tracking-tight">Consistency Heatmap</h3>
                    <p className="text-xs text-muted-foreground">{dateString}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 text-muted-foreground hover:text-accent transition-colors">
                        <Info className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-px bg-border/60 mx-1" />
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{Math.round(daysToShow / 30.43)} Months</p>
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="relative pb-4" ref={containerRef}>
                <div className="flex gap-0.5 justify-start">
                    {/* Y-Axis Labels (Days) */}
                    <div
                        ref={labelRef}
                        className="flex flex-col gap-0.5 pt-4.5 text-[8px] text-muted-foreground/50 select-none pr-1.5 uppercase font-medium shrink-0"
                    >
                        <div className="h-2.5 flex items-center shrink-0"></div>
                        <div className="h-2.5 flex items-center shrink-0">Mon</div>
                        <div className="h-2.5 flex items-center shrink-0"></div>
                        <div className="h-2.5 flex items-center shrink-0">Wed</div>
                        <div className="h-2.5 flex items-center shrink-0"></div>
                        <div className="h-2.5 flex items-center shrink-0">Fri</div>
                        <div className="h-2.5 flex items-center shrink-0"></div>
                    </div>

                    {weeks.map((week, weekIndex) => {
                        const firstDayOfWeek = week[0];
                        const isNewMonth = weekIndex === 0 || !isSameMonth(firstDayOfWeek, weeks[weekIndex - 1][0]);

                        return (
                            <div key={weekIndex} className="flex flex-col gap-0.5 items-center w-2.5 shrink-0">
                                {/* X-Axis Labels (Months) */}
                                <div className="h-4 text-[8px] text-muted-foreground/50 select-none font-medium uppercase whitespace-nowrap">
                                    {isNewMonth && format(firstDayOfWeek, "MMM")}
                                </div>
                                {week.map((day) => {
                                    const dateKey = format(day, "yyyy-MM-dd");
                                    const count = activityMap.get(dateKey) || 0;
                                    const intensityClass = getIntensity(count);

                                    return (
                                        <div
                                            key={dateKey}
                                            className={`w-2.5 h-2.5 rounded-xs ${intensityClass} elevation-1 transition-all duration-300 hover:ring-1 hover:ring-accent-foreground/30 relative group/cell cursor-pointer`}
                                            onMouseEnter={(e) => handleMouseEnter(day, count, e)}
                                            onMouseLeave={() => setHovered(null)}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tooltip Portal */}
            {hovered && (
                <Portal>
                    <div
                        className="fixed pointer-events-none z-9999"
                        style={{
                            left: hovered.rect.left + hovered.rect.width / 2,
                            top: hovered.rect.top - 8,
                            transform: 'translate(-50%, -100%)'
                        }}
                    >
                        <div className="px-3 py-2 bg-muted/95 backdrop-blur-md border border-border rounded-lg text-[10px] whitespace-nowrap elevation-4 animate-in fade-in zoom-in-95">
                            <div className="font-semibold">{format(hovered.date, "MMM d, yyyy")}</div>
                            <div className="text-muted-foreground">{hovered.count} exercises performed</div>
                            {/* Simple triangle arrow */}
                            <div
                                className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-muted/95"
                            />
                        </div>
                    </div>
                </Portal>
            )}

            {/* Legend */}
            <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 bg-muted rounded-[1px] elevation-1" />
                    <div className="w-2.5 h-2.5 bg-pink-900/40 rounded-[1px] elevation-1" />
                    <div className="w-2.5 h-2.5 bg-pink-700/60 rounded-[1px] elevation-1" />
                    <div className="w-2.5 h-2.5 bg-accent/80 rounded-[1px] elevation-1" />
                    <div className="w-2.5 h-2.5 bg-accent rounded-[1px] elevation-1" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
}
