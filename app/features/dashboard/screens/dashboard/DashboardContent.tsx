"use client";

import { PageHeader } from "@/app/components/ui";
import { MuscleOutputTable } from "./ui/MuscleOutputTable";
import { DashboardHeader } from "./ui/DashboardHeader";
import { FatigueTrendLine } from "./ui/FatigueTrendLine";
import { SessionVolumeChart } from "./ui/SessionVolumeChart";

export function DashboardContent() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground pb-20">
            <PageHeader 
                title="Dashboard" 
                subtitle="Track your training progress and volume" 
            />

            <div className="flex-1 max-w-lg md:max-w-5xl mx-auto w-full px-4 md:px-8 py-4 md:py-8 space-y-6">
                <DashboardHeader />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="animate-slide-up" style={{ animationDelay: '50ms' }}>
                        <FatigueTrendLine />
                    </div>
                    <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                        <SessionVolumeChart />
                    </div>
                </div>

                <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
                    <MuscleOutputTable />
                </div>
            </div>
        </div>
    );
}
