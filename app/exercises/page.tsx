import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader, CardSkeletonList } from "@/app/components/ui";
import { ExercisesContent } from "@/app/features/exercises/components/ExercisesContent";

export default function ExercisesPage() {
    return (
        <div className="min-h-screen pb-20">
            <PageHeader
                title="Exercises"
                subtitle="Browse and manage your exercise library"
                action={
                    <Link
                        href="/exercises/new"
                        className="flex items-center gap-1.5 bg-accent/10 hover:bg-accent/20
                            text-accent font-display font-semibold text-sm
                            px-3 py-1.5 rounded-xl transition-all duration-200 active:animate-press"
                    >
                        <Plus className="w-4 h-4" />
                        Add
                    </Link>
                }
            />

            <main className="max-w-lg md:max-w-5xl mx-auto px-4 md:px-8 py-4 md:py-8">
                <Suspense fallback={<CardSkeletonList count={6} />}>
                    <ExercisesContent />
                </Suspense>
            </main>
        </div>
    );
}
