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
        <div className="space-y-6 animate-slide-up">
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
            <PreviousFeedbackList
                feedbackEntries={feedbackEntries}
                isLoading={isLoadingHistory}
                error={historyError instanceof Error ? historyError : null}
                onRefresh={() => void refetchFeedbackHistory()}
            />
        </div>
    );
}
