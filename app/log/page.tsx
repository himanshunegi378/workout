import { Suspense } from "react";
import { PageHeader, BottomNav, CardSkeletonList } from "@/app/components/ui";
import { LogContent } from "./components/LogContent";

export default function LogPage() {
    return (
        <div className="min-h-screen pb-20">
            <PageHeader title="Workout Log" />

            <main className="max-w-lg mx-auto px-4 py-4">
                <Suspense fallback={<CardSkeletonList count={3} />}>
                    <LogContent />
                </Suspense>
            </main>

            <BottomNav />
        </div>
    );
}
