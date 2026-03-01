import { defineConfig } from "vitest/config";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

export default defineConfig({
    test: {
        environment: "node",
        globals: true,
        setupFiles: ["./tests/setup.ts"],
        alias: {
            "@": path.resolve(__dirname, "./"),
        },
        // Integration tests must run sequentially to avoid DB truncation races
        fileParallelism: false,
        include: ["tests/integration/**/*.test.ts"],
    },
});
