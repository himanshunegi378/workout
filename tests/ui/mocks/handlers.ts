import { exerciseHandlers } from "@/app/features/exercises/__tests__/mocks/handlers";

/**
 * Global MSW handler registry.
 *
 * This file exclusively aggregates handler arrays exported from each feature's
 * __tests__/mocks/handlers.ts. Do NOT define individual http.get/post/... calls here.
 *
 * To add a new feature:
 *   1. Create app/features/<domain>/__tests__/mocks/handlers.ts
 *   2. Import the named array here and spread it below.
 */
export const handlers = [
    ...exerciseHandlers,
];
