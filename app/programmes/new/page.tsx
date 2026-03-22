"use client";
import { PageHeader } from "@/app/components/ui";
import { AddProgrammeForm } from "@/app/features/programs/screens";

export default function AddProgrammePage() {
    return (
        <div className="min-h-screen pb-20">
            <PageHeader title="New Program" backHref="/" showBackDefault />

            <main className="max-w-lg md:max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8">
                <AddProgrammeForm />
            </main>
        </div>
    );
}
