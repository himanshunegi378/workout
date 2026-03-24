"use client";
import { PageShell } from "@/app/components/ui";
import { PageHeader } from "@/app/features/page-header";
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
