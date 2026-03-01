"use client";

import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

export function DashboardHeader() {
    const [dateString, setDateString] = useState<string | null>(null);

    useEffect(() => {
        setDateString(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));
    }, []);

    return (
        <div className="relative overflow-hidden p-6 rounded-3xl bg-card border border-border animate-slide-up elevation-1" style={{ animationDelay: '0ms' }}>
            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <h2 className="font-display text-2xl font-bold mb-1 text-foreground tracking-tight">Summary</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed min-h-[1.25rem]">
                        {dateString}
                    </p>
                </div>
                <div className="bg-accent/10 p-3 rounded-full flex items-center justify-center border border-accent/20">
                    <Activity className="w-6 h-6 text-accent" />
                </div>
            </div>
        </div>
    );
}
