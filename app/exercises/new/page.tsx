import { PageHeader, PageShell } from "@/app/components/ui";
import { AddExerciseForm } from "@/app/features/exercises/screens";

export default function AddExercisePage() {
    return (
        <PageShell
            size="md"
            contentClassName="py-6 sm:py-8 lg:py-10"
            header={<PageHeader title="New Exercise" backHref="/exercises" showBackDefault />}
        >
            <AddExerciseForm />
        </PageShell>
    );
}
