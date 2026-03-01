import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./tests/ui/setup.ts"],
        include: ["tests/ui/**/*.test.{ts,tsx}", "app/**/*.test.{ts,tsx}"],
        alias: {
            "@": path.resolve(__dirname, "./"),
        },
        css: {
            modules: {
                classNameStrategy: "non-scoped",
            },
        },
        coverage: {
            provider: "v8",
            include: ["app/components/**", "app/features/**"],
            exclude: ["**/*.test.{ts,tsx}", "**/test-utils/**"],
        },
    },
});
