import { Suspense } from "react";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { PageShell } from "@/app/components/ui/PageShell";
import { SettingsContent } from "@/app/features/settings/screens";

export default function SettingsPage() {
    return (
        <PageShell size="lg" header={<PageHeader title="Settings" />}>
            <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-2xl" />}>
                <SettingsContent />
            </Suspense>
        </PageShell>
    );
}
