import { Suspense } from "react";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { BottomNav } from "@/app/components/ui/BottomNav";
import { SettingsContent } from "./components/SettingsContent";

export default function SettingsPage() {
    return (
        <div className="min-h-screen pb-20">
            <PageHeader title="Settings" />
            <main className="max-w-lg mx-auto px-4 py-4">
                <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-2xl" />}>
                    <SettingsContent />
                </Suspense>
            </main>
            <BottomNav />
        </div>
    );
}
