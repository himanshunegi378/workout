import { PageHeader, BottomNav } from "@/app/components/ui";
import { AddProgramForm } from "@/app/features/programs/components/AddProgramForm";

export default function AddGroupPage() {
    return (
        <div className="min-h-screen pb-20">
            <PageHeader title="New Program" backHref="/" />

            <main className="max-w-lg mx-auto px-4 py-6">
                <AddProgramForm />
            </main>

            <BottomNav />
        </div>
    );
}
