import { Suspense } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { PageShell, CardSkeletonList } from "@/components/ui";
import { PageHeader } from "@/features/page-header";
import { ProgrammeList } from "@/features/programmes/screens";

/**
 * Lists the lifter's training programmes.
 */
export function HomePage() {
    return (
        <PageShell
            size="xl"
            header={
                <PageHeader
                    title="My Programs"
                    subtitle="Manage your training splits and plans"
                    action={
                        <Link
                            to="/programmes/new"
                            className="rounded-xl p-2 transition-colors hover:bg-muted"
                        >
                            <Plus className="h-5 w-5 text-accent" />
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
