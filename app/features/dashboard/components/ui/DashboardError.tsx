"use client";

import { PageHeader, BottomNav } from "@/app/components/ui";

export function DashboardError() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground pb-20">
            <PageHeader title="Dashboard" />
            <div className="flex-1 px-4 py-6">
                <div className="bg-danger/10 text-danger-foreground border border-danger/30 p-4 rounded-xl flex items-start gap-3">
                    <p>Failed to load dashboard data. Please try again.</p>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
