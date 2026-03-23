"use client";

import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

export function DashboardHeader() {
    const [dateString, setDateString] = useState<string | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDateString(new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }));
    }, []);

    return (
        <div
            className="animate-slide-up flex flex-col gap-4 border-b border-border/40 pb-5 md:flex-row md:items-end md:justify-between"
            style={{ animationDelay: "0ms" }}
        >
            <div className="min-w-0 max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Dashboard</p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                    Training summary
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Workload, fatigue, and muscle balance at a glance.
                </p>
            </div>

            <div className="flex items-center gap-3 text-sm text-foreground/80">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/40 text-accent">
                    <Activity className="h-5 w-5" />
                </span>
                <span className="min-h-[1.25rem]">{dateString}</span>
            </div>
        </div>
    );
}
