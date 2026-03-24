import { PageShell } from "@/app/components/ui";
import { PageHeader } from "@/app/features/page-header";
import { AddExerciseForm } from "@/app/features/exercises/screens";

export default function AddExercisePage() {
    return (
        <PageShell
            size="md"
            spacing="comfortable"
            header={<PageHeader title="New Exercise" backHref="/exercises" showBackDefault />}
        >
            <AddExerciseForm />
        </PageShell>
    );
}
