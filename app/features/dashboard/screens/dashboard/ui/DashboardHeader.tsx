"use client";

import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

export function DashboardHeader() {
    const [dateString, setDateString] = useState<string | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDateString(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));
    }, []);

    return (
        <div className="flex items-start justify-between gap-4 animate-slide-up" style={{ animationDelay: "0ms" }}>
            <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Dashboard</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">Summary</h2>
                <p className="mt-1 text-sm text-muted-foreground min-h-[1.25rem]">
                    {dateString}
                </p>
            </div>
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-accent">
                <Activity className="h-5 w-5" />
            </div>
        </div>
    );
}
