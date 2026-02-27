"use client";

import { PageHeader, BottomNav } from "@/app/components/ui";
import { Loader2 } from "lucide-react";

export function DashboardLoading() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground pb-20">
            <PageHeader title="Dashboard" />
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
            </div>
            <BottomNav />
        </div>
    );
}
