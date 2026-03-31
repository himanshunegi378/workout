"use client";

import { PageHeader } from "@/app/features/page-header";
import { MuscleOutputTable } from "./ui/MuscleOutputTable";
import { FatigueTrendLine } from "./ui/FatigueTrendLine";
import { SessionVolumeChart } from "./ui/SessionVolumeChart";
import { WorkoutHeatmap } from "@/app/features/analytics/components/WorkoutHeatmap";

export function DashboardContent() {
    return (
        <div className="min-h-screen pb-20 text-foreground">
            <PageHeader
                title="Dashboard"
                subtitle="Track your training progress and volume"
            />

            <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                <div className="mb-6 md:mb-8 animate-slide-up" style={{ animationDelay: "50ms" }}>
                    <WorkoutHeatmap />
                </div>

                <section className="space-y-6 md:space-y-8">
                    <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
                        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
                            <FatigueTrendLine />
                        </div>
                        <div className="animate-slide-up" style={{ animationDelay: "150ms" }}>
                            <SessionVolumeChart />
                        </div>
                    </div>
                </section>

                <div className="mt-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
                    <MuscleOutputTable />
                </div>
            </main>
        </div>
    );
}
