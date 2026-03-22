export type SubmitFeedbackData = {
    description: string;
};

export type SubmitFeedbackResponse = {
    status?: string;
};

/**
 * Persists a new feedback entry for the current user.
 */
export async function submitFeedback(data: SubmitFeedbackData): Promise<SubmitFeedbackResponse> {
    const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const payload = (await response.json().catch(() => null)) as
        | { error?: string; status?: string }
        | null;

    if (!response.ok) {
        throw new Error(payload?.error || "Failed to submit feedback");
    }

    return payload ?? {};
}
