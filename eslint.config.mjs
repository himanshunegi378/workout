import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  globalIgnores([
    "backend/**",
    "react-client/**",
    "node_modules/**",
    ".next/**",
    "dist/**",
    "out/**",
    "build/**",
  ]),
]);

export default eslintConfig;
