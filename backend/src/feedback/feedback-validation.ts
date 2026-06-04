import { z } from "zod";

const MIN_DESCRIPTION_LENGTH = 5;
const MAX_DESCRIPTION_LENGTH = 1000;

export const FeedbackPayloadSchema = z.object({
  description: z.string()
    .trim()
    .min(MIN_DESCRIPTION_LENGTH, `Feedback must be at least ${MIN_DESCRIPTION_LENGTH} characters`)
    .max(MAX_DESCRIPTION_LENGTH, `Feedback must be ${MAX_DESCRIPTION_LENGTH} characters or less`),
});
