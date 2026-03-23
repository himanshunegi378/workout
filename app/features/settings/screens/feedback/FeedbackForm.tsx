"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui";
import { useFeedbackHistory } from "../../api/query-hooks/use-feedback-history";
import { useSubmitFeedback } from "../../api/mutation-hooks/use-submit-feedback";
import { PreviousFeedbackList } from "./components/ui/PreviousFeedbackList";

const MIN_DESCRIPTION_LENGTH = 5;
const MAX_DESCRIPTION_LENGTH = 1000;

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
        <div className="space-y-8 animate-slide-up">
            <form onSubmit={handleSubmit} className="space-y-6 border-b border-border/60 pb-8">
                <div className="space-y-3">
                    <div className="space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/85">
                            New feedback
                        </p>
                        <label htmlFor="feedback-description" className="block text-sm font-medium text-foreground">
                            Description
                        </label>
                    </div>
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
                        className="min-h-36 w-full resize-y rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/90 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="flex items-center justify-between text-xs text-foreground/80">
                        <span>Minimum {MIN_DESCRIPTION_LENGTH} characters</span>
                        <span>{trimmedDescription.length}/{MAX_DESCRIPTION_LENGTH}</span>
                    </div>
                </div>

                {submitError && (
                    <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
                        {submitError instanceof Error ? submitError.message : "Failed to submit feedback"}
                    </div>
                )}

                {showSubmissionSuccess && (
                    <div className="rounded-2xl border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-foreground">
                        Thanks. Your feedback has been submitted.
                    </div>
                )}

                <div className="flex justify-end">
                    <Button type="submit" disabled={!canSubmit} className="w-full sm:w-auto !text-background">
                        {isSubmitting ? "Sending..." : "Submit Feedback"}
                    </Button>
                </div>
            </form>
            <PreviousFeedbackList
                feedbackEntries={feedbackEntries}
                isLoading={isLoadingHistory}
                error={historyError instanceof Error ? historyError : null}
                onRefresh={() => void refetchFeedbackHistory()}
            />
        </div>
    );
}
