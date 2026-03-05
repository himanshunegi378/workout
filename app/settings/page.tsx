import { Suspense } from "react";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { SettingsContent } from "./components/SettingsContent";

export default function SettingsPage() {
    return (
        <div className="min-h-screen pb-20">
            <PageHeader title="Settings" />
            <main className="max-w-lg md:max-w-5xl mx-auto px-4 md:px-8 py-4 md:py-8">
                <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-2xl" />}>
                    <SettingsContent />
                </Suspense>
            </main>
        </div>
    );
}
