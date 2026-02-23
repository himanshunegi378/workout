import { PageHeader, BottomNav } from "@/app/components/ui";
import { AddExerciseForm } from "@/app/features/exercises/components/AddExerciseForm";

export default function AddExercisePage() {
    return (
        <div className="min-h-screen pb-20">
            <PageHeader title="New Exercise" backHref="/" />

            <main className="max-w-lg mx-auto px-4 py-6">
                <AddExerciseForm />
            </main>

            <BottomNav />
        </div>
    );
}
