"use client";
import { PageHeader, PageShell } from "@/app/components/ui";
import { AddProgrammeForm } from "@/app/features/programs/screens";

export default function AddProgrammePage() {
    return (
        <PageShell
            size="md"
            contentClassName="py-6 sm:py-8 lg:py-10"
            header={<PageHeader title="New Program" backHref="/" showBackDefault />}
        >
            <AddProgrammeForm />
        </PageShell>
    );
}
