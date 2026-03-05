import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader, CardSkeletonList } from "@/app/components/ui";
import { ProgrammeList } from "@/app/features/programs/components/ProgrammeList";

export default function HomePage() {
    return (
        <div className="min-h-screen pb-20">
            <PageHeader
                title="My Programs"
                subtitle="Manage your training splits and plans"
                action={
                    <Link
                        href="/programmes/new"
                        className="p-2 rounded-xl hover:bg-muted transition-colors"
                    >
                        <Plus className="w-5 h-5 text-accent" />
                    </Link>
                }
            />

            <main className="max-w-lg md:max-w-5xl mx-auto px-4 md:px-8 py-4 md:py-8">
                <Suspense fallback={<CardSkeletonList count={4} />}>
                    <ProgrammeList />
                </Suspense>
            </main>
        </div>
    );
}
