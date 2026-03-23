import Link from "next/link";
import { Layers, Plus } from "lucide-react";
import { EmptyState } from "@/app/components/ui";

/**
 * A specialized empty state component for when no training programmes exist.
 */
export function ProgrammesEmptyState() {
    return (
        <EmptyState
            icon={Layers}
            title="No Programs Yet"
            description="Create your first training plan to start organizing workouts."
            action={
                <Link
                    href="/programmes/new"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-display text-sm font-semibold !text-background transition-colors hover:bg-accent-hover"
                >
                    <Plus className="w-4 h-4" /> Create Program
                </Link>
            }
        />
    );
}
