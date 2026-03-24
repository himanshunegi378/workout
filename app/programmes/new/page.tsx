"use client";
import { PageHeader, PageShell } from "@/app/components/ui";
import { AddProgrammeForm } from "@/app/features/programs/screens";

export default function AddProgrammePage() {
    return (
        <PageShell
            size="md"
            spacing="comfortable"
            header={<PageHeader title="New Program" backHref="/" showBackDefault />}
        >
            <AddProgrammeForm />
        </PageShell>
    );
}
