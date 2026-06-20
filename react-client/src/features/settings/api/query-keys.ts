/**
 * Query key factory for feedback-related queries in settings.
 */
export const feedbackKeys = {
    all: ["feedback"] as const,
    lists: () => [...feedbackKeys.all, "list"] as const,
};
