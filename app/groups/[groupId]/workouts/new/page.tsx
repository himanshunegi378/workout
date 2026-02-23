import { use } from "react";
import { PageHeader, BottomNav } from "@/app/components/ui";
import { AddWorkoutForm } from "@/app/features/workouts/components/AddWorkoutForm";

interface PageProps {
    params: Promise<{ groupId: string }>;
}

export default function AddWorkoutPage({ params }: PageProps) {
    const { groupId } = use(params);

    return (
        <div className="min-h-screen pb-20">
            <PageHeader title="New Workout" backHref={`/groups/${groupId}`} />

            <main className="max-w-lg mx-auto px-4 py-6">
                <AddWorkoutForm groupId={groupId} />
            </main>

            <BottomNav />
        </div>
    );
}
