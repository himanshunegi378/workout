"use client";

import { PageHeader, BottomNav } from "@/app/components/ui";
import { MuscleOutputTable } from "./ui/MuscleOutputTable";
import { DashboardHeader } from "./ui/DashboardHeader";
import { FatigueTrendLine } from "./FatigueTrendLine";
import { SessionVolumeChart } from "./SessionVolumeChart";

export function DashboardContent() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground pb-20">
            <PageHeader title="Dashboard" />

            <div className="flex-1 px-4 py-4 space-y-6">
                <DashboardHeader />
                <div className="animate-slide-up" style={{ animationDelay: '50ms' }}>
                    <FatigueTrendLine />
                </div>
                <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <SessionVolumeChart />
                </div>
                <MuscleOutputTable />
            </div>
            <BottomNav />
        </div>
    );
}
