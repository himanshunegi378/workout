"use client";

import { use } from "react";
import { PageHeader, BottomNav } from "@/app/components/ui";
import { AddWorkoutForm } from "@/app/features/workouts/components/AddWorkoutForm";

interface PageProps {
    params: Promise<{ programmeId: string }>;
}

export default function AddWorkoutPage({ params }: PageProps) {
    const { programmeId } = use(params);

    return (
        <div className="min-h-screen pb-20">
            <PageHeader title="New Workout" backHref={`/programmes/${programmeId}`} />

            <main className="max-w-lg mx-auto px-4 py-6">
                <AddWorkoutForm programmeId={programmeId} />
            </main>

            <BottomNav />
        </div>
    );
}
