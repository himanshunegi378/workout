import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader, PageShell, CardSkeletonList } from "@/app/components/ui";
import { ProgrammeList } from "@/app/features/programs/screens";

export default function HomePage() {
    return (
        <PageShell
            size="xl"
            header={
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
            }
        >
            <Suspense fallback={<CardSkeletonList count={4} />}>
                <ProgrammeList />
            </Suspense>
        </PageShell>
    );
}
