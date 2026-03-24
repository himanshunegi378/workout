"use client";

import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import { FeedbackStatus } from "@/app/generated/prisma";
import { Button, List } from "@/app/components/ui";
import type { FeedbackListItem } from "../../../../api/query-hooks/use-feedback-history";

const STATUS_STYLES: Record<FeedbackStatus, string> = {
    [FeedbackStatus.Submitted]: "bg-background/75 text-foreground",
    [FeedbackStatus.UnderReview]: "bg-warning/20 text-foreground",
    [FeedbackStatus.Planned]: "bg-sky-500/20 text-sky-950 dark:text-sky-50",
    [FeedbackStatus.Completed]: "bg-emerald-500/20 text-emerald-950 dark:text-emerald-50",
    [FeedbackStatus.Rejected]: "bg-danger/20 text-danger",
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
        <List.Root density="compact">
            <List.Header className="space-y-4">
                <List.Intro className="sm:items-start">
                    <List.Heading>
                        <List.Eyebrow className="text-muted-foreground/85">Previous feedback</List.Eyebrow>
                        <List.Title className="text-lg md:text-lg">Your earlier submissions</List.Title>
                        <List.Description className="text-foreground/85">
                            Review your earlier submissions and their current status.
                        </List.Description>
                    </List.Heading>
                    <List.Actions>
                        <Button type="button" variant="ghost" onClick={onRefresh} disabled={isLoading}>
                            Refresh
                        </Button>
                    </List.Actions>
                </List.Intro>
            </List.Header>

            {isLoading && (
                <List.Loading
                    icon={Loader2}
                    title="Loading feedback history..."
                    className="py-8"
                />
            )}

            {error && (
                <List.Error
                    icon={AlertTriangle}
                    title="Could not load feedback"
                    description={error.message}
                    className="py-8"
                />
            )}

            {!isLoading && !error && feedbackEntries.length === 0 && (
                <List.Empty
                    icon={Inbox}
                    title="No feedback yet"
                    description="You have not submitted any feedback yet."
                    className="py-8"
                />
            )}

            {!isLoading && !error && feedbackEntries.length > 0 && (
                <List.Content className="space-y-0" gap="md">
                    {feedbackEntries.map((entry, index) => (
                        <List.Item
                            key={entry.id}
                            index={index}
                            className="space-y-3 py-4 first:pt-0"
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
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[entry.status]}`}
                                >
                                    {entry.status}
                                </span>
                            </div>

                            <p className="text-sm leading-6 text-foreground whitespace-pre-wrap">
                                {entry.description}
                            </p>
                        </List.Item>
                    ))}
                </List.Content>
            )}
        </List.Root>
    );
}
