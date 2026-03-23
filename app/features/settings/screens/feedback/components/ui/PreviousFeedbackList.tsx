"use client";

import { FeedbackStatus } from "@/app/generated/prisma";
import { Button } from "@/app/components/ui";
import type { FeedbackListItem } from "../../../../api/query-hooks/use-feedback-history";

const STATUS_STYLES: Record<FeedbackStatus, string> = {
    [FeedbackStatus.Submitted]: "bg-accent/10 text-accent border-accent/20",
    [FeedbackStatus.UnderReview]: "bg-warning/10 text-warning border-warning/20",
    [FeedbackStatus.Planned]: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
    [FeedbackStatus.Completed]: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    [FeedbackStatus.Rejected]: "bg-danger/10 text-danger border-danger/20",
};

type PreviousFeedbackListProps = {
    feedbackEntries: FeedbackListItem[];
    isLoading: boolean;
    error: Error | null;
    onRefresh: () => void;
};

/**
 * Displays the user's previously submitted feedback and current statuses.
 */
export function PreviousFeedbackList({
    feedbackEntries,
    isLoading,
    error,
    onRefresh,
}: PreviousFeedbackListProps) {
    function formatSubmittedAt(value: string) {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        }).format(new Date(value));
    }

    return (
        <section className="bg-card rounded-2xl p-5 border border-border space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h3 className="text-lg font-display font-semibold">Previous Feedback</h3>
                    <p className="text-sm text-muted-foreground">
                        Review your earlier submissions and their current status.
                    </p>
                </div>
                <Button type="button" variant="ghost" onClick={onRefresh} disabled={isLoading}>
                    Refresh
                </Button>
            </div>

            {isLoading && (
                <div className="rounded-xl border border-border bg-muted/40 px-4 py-5 text-sm text-muted-foreground">
                    Loading feedback history...
                </div>
            )}

            {error && (
                <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-danger text-sm">
                    {error.message}
                </div>
            )}

            {!isLoading && !error && feedbackEntries.length === 0 && (
                <div className="rounded-xl border border-border bg-muted/30 px-4 py-5 text-sm text-muted-foreground">
                    You have not submitted any feedback yet.
                </div>
            )}

            {!isLoading && !error && feedbackEntries.length > 0 && (
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
    );
}
