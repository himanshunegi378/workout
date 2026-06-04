import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { PageShell, EmptyState } from "@/components/ui";

/**
 * Shared fallback for routes or records that cannot be found.
 */
export function NotFound() {
    return (
        <PageShell size="md" spacing="comfortable">
            <EmptyState
                icon={Search}
                title="Not found"
                description="The page or workout record could not be found."
                action={
                    <Link
                        to="/"
                        className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
                    >
                        Go to programs
                    </Link>
                }
            />
        </PageShell>
    );
}
