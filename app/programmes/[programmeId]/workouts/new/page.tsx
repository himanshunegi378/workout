"use client";

import { use } from "react";
import { PageHeader } from "@/app/components/ui";
import { AddWorkoutForm } from "@/app/features/workouts/components/AddWorkoutForm";

interface PageProps {
    params: Promise<{ programmeId: string }>;
}

export default function AddWorkoutPage({ params }: PageProps) {
    const { programmeId } = use(params);

    return (
        <div className="min-h-screen pb-20">
            <PageHeader title="New Workout" backHref={`/programmes/${programmeId}`} showBackDefault />

            <main className="max-w-lg md:max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8">
                <AddWorkoutForm programmeId={programmeId} />
            </main>
        </div>
    );
}
