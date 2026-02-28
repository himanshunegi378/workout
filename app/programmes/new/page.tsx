import { PageHeader, BottomNav } from "@/app/components/ui";
import { AddProgrammeForm } from "@/app/features/programs/components/AddProgrammeForm";

export default function AddProgrammePage() {
    return (
        <div className="min-h-screen pb-20">
            <PageHeader title="New Program" backHref="/" />

            <main className="max-w-lg mx-auto px-4 py-6">
                <AddProgrammeForm />
            </main>

            <BottomNav />
        </div>
    );
}
