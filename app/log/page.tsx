import { Suspense } from "react";
import { PageHeader, CardSkeletonList } from "@/app/components/ui";
import { LogContent } from "@/app/features/logging/components/LogContent";

export default function LogPage() {
    return (
        <div className="min-h-screen pb-20">
            <PageHeader 
                title="Workout Log" 
                subtitle="History of your previous training sessions" 
            />

            <main className="max-w-lg md:max-w-5xl mx-auto px-4 md:px-8 py-4 md:py-8">
                <Suspense fallback={<CardSkeletonList count={3} />}>
                    <LogContent />
                </Suspense>
            </main>
        </div>
    );
}
