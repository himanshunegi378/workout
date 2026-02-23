import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader, BottomNav, CardSkeletonList } from "@/app/components/ui";
import { SignOutButton } from "@/app/components/SignOutButton";
import { WorkoutGroupList } from "@/app/features/programs/components/WorkoutGroupList";

export default function HomePage() {
    return (
        <div className="min-h-screen pb-20">
            <PageHeader
                title="My Programs"
                action={
                    <div className="flex items-center gap-1">
                        <Link
                            href="/groups/new"
                            className="p-2 rounded-xl hover:bg-muted transition-colors"
                        >
                            <Plus className="w-5 h-5 text-accent" />
                        </Link>
                        <SignOutButton />
                    </div>
                }
            />

            <main className="max-w-lg mx-auto px-4 py-4">
                <Suspense fallback={<CardSkeletonList count={4} />}>
                    <WorkoutGroupList />
                </Suspense>
            </main>

            <BottomNav />
        </div>
    );
}
