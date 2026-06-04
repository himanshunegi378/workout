import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default defineConfig([
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      import: importPlugin,
      "react-hooks": reactHooks,
      "react-compiler": (await import("eslint-plugin-react-compiler")).default,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "import/no-cycle": "error",
      ...reactHooks.configs.recommended.rules,
      "react-compiler/react-compiler": "error",
    },
  },
  globalIgnores([
    "dist/**",
    "node_modules/**",
    "src/**/__tests__/**",
    "src/**/*.test.ts",
    "src/**/*.test.tsx",
    "src/**/scripts/**",
  ]),
]);
