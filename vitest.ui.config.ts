import { defineConfig } from "vitest/config";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./tests/ui/setup.ts"],
        alias: {
            "@": path.resolve(__dirname, "./"),
        },
        include: [
            "app/components/ui/**/*.test.tsx",
            "app/features/dashboard/**/*.test.ts",
            "app/features/dashboard/**/*.test.tsx",
            "tests/ui/**/*.test.ts",
            "tests/ui/**/*.test.tsx",
        ],
        exclude: [
            "tests/integration/**",
            "tests/api/**",
        ],
    },
});
