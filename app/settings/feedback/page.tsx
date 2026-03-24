import { Suspense } from "react";
import { PageHeader } from "@/app/features/page-header";
import { PageShell } from "@/app/components/ui/PageShell";
import { FeedbackForm } from "@/app/features/settings/screens/feedback/FeedbackForm";
import { requireUserId } from "@/lib/auth-helpers";

/**
 * Feedback submission screen surfaced from Settings.
 */
export default async function FeedbackPage() {
    await requireUserId();

    return (
        <PageShell
            size="md"
            header={
                <PageHeader
                    title="Feedback"
                    subtitle="Suggestions and issues"
                    backHref="/settings"
                />
            }
        >
            <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-2xl" />}>
                <FeedbackForm />
            </Suspense>
        </PageShell>
    );
}
