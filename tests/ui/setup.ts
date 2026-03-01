import "@testing-library/jest-dom/vitest";
import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./mocks/server";
import { cleanup } from "@testing-library/react";

// Start MSW server before all tests
beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
});

// Reset handlers and clean up DOM after each test
afterEach(() => {
    server.resetHandlers();
    cleanup();
});

// Shut down MSW server after all tests
afterAll(() => {
    server.close();
});
