import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      "react-compiler": (await import("eslint-plugin-react-compiler")).default,
    },
    rules: {
      "import/no-cycle": "error",
      "react-compiler/react-compiler": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    "app/generated/**",
    ".next/**",
    "out/**",
    "build/**",
    "backend/dist/**",
    "react-client/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
