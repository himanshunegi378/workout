"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FeedbackStatus } from "@/app/generated/prisma";
import { Button } from "@/app/components/ui";
import { useFeedbackHistory } from "../../api/query-hooks/use-feedback-history";
import { useSubmitFeedback } from "../../api/mutation-hooks/use-submit-feedback";

const MIN_DESCRIPTION_LENGTH = 5;
const MAX_DESCRIPTION_LENGTH = 1000;
const STATUS_STYLES: Record<FeedbackStatus, string> = {
    [FeedbackStatus.Submitted]: "bg-accent/10 text-accent border-accent/20",
    [FeedbackStatus.UnderReview]: "bg-warning/10 text-warning border-warning/20",
    [FeedbackStatus.Planned]: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
    [FeedbackStatus.Completed]: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    [FeedbackStatus.Rejected]: "bg-danger/10 text-danger border-danger/20",
};

/**
 * Renders the feedback submission form and posts a new feedback entry for the
 * authenticated user.
 */
export function FeedbackForm() {
    const router = useRouter();
    const [description, setDescription] = useState("");
    const {
        data: feedbackEntries = [],
        isLoading: isLoadingHistory,
        error: historyError,
        refetch: refetchFeedbackHistory,
    } = useFeedbackHistory();
    const {
        mutate: submitFeedback,
        isPending: isSubmitting,
        isSuccess: isSubmitSuccess,
        error: submitError,
        reset: resetSubmitFeedback,
    } = useSubmitFeedback();

    const trimmedDescription = description.trim();
    const showSubmissionSuccess = description === "" && isSubmitSuccess;
    const canSubmit =
        trimmedDescription.length >= MIN_DESCRIPTION_LENGTH &&
        trimmedDescription.length <= MAX_DESCRIPTION_LENGTH &&
        !isSubmitting;

    /**
     * Formats a feedback timestamp for compact display in the history list.
     */
    function formatSubmittedAt(value: string) {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        }).format(new Date(value));
    }

    /**
     * Validates and submits the feedback form to the API, then surfaces the
     * initial server-assigned status back into the UI.
     */
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!canSubmit) return;

        submitFeedback(
            {
                description: trimmedDescription,
            },
            {
                onSuccess: () => {
                    setDescription("");
                    router.refresh();
                },
            }
        );
    }

    return (
        <div className="space-y-6 animate-slide-up">
            <section className="bg-card rounded-2xl p-5 border border-border space-y-3">
                <h2 className="text-lg font-display font-semibold">Tell us what would help</h2>
                <p className="text-sm text-muted-foreground">
                    Share an idea, report friction, or tell us what feels off. A short description is enough.
                </p>
            </section>

            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-5 border border-border space-y-5">
                <div className="space-y-3">
                    <label htmlFor="feedback-description" className="block text-sm font-medium text-foreground">
                        Description
                    </label>
                    <textarea
                        id="feedback-description"
                        rows={6}
                        maxLength={MAX_DESCRIPTION_LENGTH}
                        placeholder="Example: It would be helpful if I could export workout history or attach notes to an exercise."
                        value={description}
                        onChange={(event) => {
                            setDescription(event.target.value);
                            if (isSubmitSuccess) {
                                resetSubmitFeedback();
                            }
                        }}
                        className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent transition-all duration-200 font-body text-base resize-y min-h-36"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Minimum {MIN_DESCRIPTION_LENGTH} characters</span>
                        <span>{trimmedDescription.length}/{MAX_DESCRIPTION_LENGTH}</span>
                    </div>
                </div>

                {submitError && (
                    <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-danger text-sm">
                        {submitError instanceof Error ? submitError.message : "Failed to submit feedback"}
                    </div>
                )}

                {showSubmissionSuccess && (
                    <div className="bg-accent/10 border border-accent/20 rounded-xl px-4 py-3 text-sm text-foreground">
                        Thanks. Your feedback has been submitted.
                    </div>
                )}

                <div>
                    <Button type="submit" className="w-full" disabled={!canSubmit}>
                        {isSubmitting ? "Sending..." : "Submit Feedback"}
                    </Button>
                </div>
            </form>

            <section className="bg-card rounded-2xl p-5 border border-border space-y-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-display font-semibold">Previous Feedback</h3>
                        <p className="text-sm text-muted-foreground">
                            Review your earlier submissions and their current status.
                        </p>
                    </div>
                    <Button type="button" variant="ghost" onClick={() => void refetchFeedbackHistory()} disabled={isLoadingHistory}>
                        Refresh
                    </Button>
                </div>

                {isLoadingHistory && (
                    <div className="rounded-xl border border-border bg-muted/40 px-4 py-5 text-sm text-muted-foreground">
                        Loading feedback history...
                    </div>
                )}

                {historyError && (
                    <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-danger text-sm">
                        {historyError instanceof Error ? historyError.message : "Failed to load feedback history"}
                    </div>
                )}

                {!isLoadingHistory && !historyError && feedbackEntries.length === 0 && (
                    <div className="rounded-xl border border-border bg-muted/30 px-4 py-5 text-sm text-muted-foreground">
                        You have not submitted any feedback yet.
                    </div>
                )}

                {!isLoadingHistory && !historyError && feedbackEntries.length > 0 && (
                    <div className="space-y-3">
                        {feedbackEntries.map((entry, index) => (
                            <article
                                key={entry.id}
                                className="rounded-2xl border border-border bg-background/60 px-4 py-4 space-y-3 animate-slide-up"
                                style={{ animationDelay: `${index * 40}ms` }}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-foreground">
                                            Submitted {formatSubmittedAt(entry.created_at)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Feedback ID: {entry.id}
                                        </p>
                                    </div>
                                    <span
                                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[entry.status]}`}
                                    >
                                        {entry.status}
                                    </span>
                                </div>

                                <p className="text-sm leading-6 text-foreground whitespace-pre-wrap">
                                    {entry.description}
                                </p>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
