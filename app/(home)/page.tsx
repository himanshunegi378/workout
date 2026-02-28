import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader, BottomNav, CardSkeletonList } from "@/app/components/ui";
import { ProgrammeList } from "@/app/features/programs/components/ProgrammeList";

export default function HomePage() {
    return (
        <div className="min-h-screen pb-20">
            <PageHeader
                title="My Programs"
                action={
                    <Link
                        href="/programmes/new"
                        className="p-2 rounded-xl hover:bg-muted transition-colors"
                    >
                        <Plus className="w-5 h-5 text-accent" />
                    </Link>
                }
            />

            <main className="max-w-lg mx-auto px-4 py-4">
                <Suspense fallback={<CardSkeletonList count={4} />}>
                    <ProgrammeList />
                </Suspense>
            </main>

            <BottomNav />
        </div>
    );
}
