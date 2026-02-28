"use client";

import { PageHeader, BottomNav } from "@/app/components/ui";
import { MuscleOutputTable } from "./ui/MuscleOutputTable";
import { DashboardHeader } from "./ui/DashboardHeader";

export function DashboardContent() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground pb-20">
            <PageHeader title="Dashboard" />

            <div className="flex-1 px-4 py-4 space-y-6">
                <DashboardHeader />
                <MuscleOutputTable />
            </div>
            <BottomNav />
        </div>
    );
}
