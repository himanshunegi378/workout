import { Suspense } from "react";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { FeedbackForm } from "@/app/features/settings/screens/feedback/FeedbackForm";
import { requireUserId } from "@/lib/auth-helpers";

/**
 * Feedback submission screen surfaced from Settings.
 */
export default async function FeedbackPage() {
    await requireUserId();

    return (
        <div className="min-h-screen pb-20">
            <PageHeader
                title="Feedback"
                subtitle="Suggestions And Issues"
                backHref="/settings"
            />
            <main className="max-w-lg md:max-w-3xl mx-auto px-4 md:px-8 py-4 md:py-8">
                <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-2xl" />}>
                    <FeedbackForm />
                </Suspense>
            </main>
        </div>
    );
}
