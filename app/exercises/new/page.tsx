import { PageHeader } from "@/app/components/ui";
import { AddExerciseForm } from "@/app/features/exercises/screens";

export default function AddExercisePage() {
    return (
        <div className="min-h-screen pb-20">
            <PageHeader title="New Exercise" backHref="/exercises" showBackDefault />

            <main className="max-w-lg md:max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8">
                <AddExerciseForm />
            </main>
        </div>
    );
}
