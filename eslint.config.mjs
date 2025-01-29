import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
/** @type {import('eslint').Linter.Config[]} */

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        tsconfigRootDir: process.cwd(),
        project: "./tsconfig.json"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      "indent": ["error", 2],
      "quotes": ["error", "single"],
      "semi": ["error", "never"],
      "eol-last": ["error", "always"],
      "no-multiple-empty-lines": ["error", { "max": 1 }],
      "space-before-function-paren": ["error", "always"],
      "comma-dangle": ["error", "never"],
      "no-trailing-spaces": "error",
      "no-console": "warn",
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-explicit-any": ["error"],
      "@typescript-eslint/explicit-function-return-type": ["warn"],
      "@typescript-eslint/consistent-type-imports": "error",
      "no-undef": "off",
      "no-unused-vars": "off",
      "no-duplicate-imports": "error",
      "eqeqeq": "error"
    }
  }
]
