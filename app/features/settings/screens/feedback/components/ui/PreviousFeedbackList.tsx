"use client";

import { FeedbackStatus } from "@/app/generated/prisma";
import { Button } from "@/app/components/ui";
import type { FeedbackListItem } from "../../../../api/query-hooks/use-feedback-history";

const STATUS_STYLES: Record<FeedbackStatus, string> = {
    [FeedbackStatus.Submitted]: "bg-background/75 text-foreground border-border/70",
    [FeedbackStatus.UnderReview]: "bg-warning/20 text-foreground border-warning/30",
    [FeedbackStatus.Planned]: "bg-sky-500/20 text-sky-950 dark:text-sky-50 border-sky-500/35",
    [FeedbackStatus.Completed]: "bg-emerald-500/20 text-emerald-950 dark:text-emerald-50 border-emerald-500/35",
    [FeedbackStatus.Rejected]: "bg-danger/20 text-danger border-danger/30",
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
        <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/85">Previous feedback</p>
                    <h3 className="mt-2 text-lg font-display font-semibold text-foreground">Your earlier submissions</h3>
                    <p className="text-sm text-foreground/85">
                        Review your earlier submissions and their current status.
                    </p>
                </div>
                <Button type="button" variant="ghost" onClick={onRefresh} disabled={isLoading}>
                    Refresh
                </Button>
            </div>

            {isLoading && (
                <div className="py-3 text-sm text-foreground/85">
                    Loading feedback history...
                </div>
            )}

            {error && (
                <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error.message}
                </div>
            )}

            {!isLoading && !error && feedbackEntries.length === 0 && (
                <div className="py-3 text-sm text-foreground/85">
                    You have not submitted any feedback yet.
                </div>
            )}

            {!isLoading && !error && feedbackEntries.length > 0 && (
                <div className="space-y-0">
                    {feedbackEntries.map((entry, index) => (
                        <article
                            key={entry.id}
                            className="space-y-3 border-t border-border/60 py-4 first:border-t-0 first:pt-0 animate-slide-up"
                            style={{ animationDelay: `${index * 40}ms` }}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-foreground">
                                        Submitted {formatSubmittedAt(entry.created_at)}
                                    </p>
                                    <p className="text-xs text-foreground/80">
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
