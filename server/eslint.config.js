import js from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
    {
        plugins: {
            "unused-imports": unusedImports,
        },
    },
    {
        files: ["**/*.{js,mjs,cjs,ts}"],
        plugins: { js },
        extends: ["js/recommended"],
    },
    {
        files: ["**/*.{js,mjs,cjs,ts}"],
        languageOptions: { globals: globals.node },
    },
    {
        rules: {
            "unused-imports/no-unused-imports": "warn",
            "unused-imports/no-unused-vars": "warn",
            "no-unused-vars": ["off", "always"],
            quotes: ["error", "double"],
            eqeqeq: ["error", "always"],
            "comma-spacing": [
                "error",
                {
                    before: false,
                    after: true,
                },
            ],
            "keyword-spacing": [
                "error",
                {
                    before: true,
                    after: true,
                },
            ],
            "object-curly-spacing": ["error", "always"],
            "arrow-parens": ["error", "always"],
            "no-trailing-spaces": ["error", {}],
            "no-multi-spaces": ["error", {}],
            "semi-spacing": [
                "error",
                {
                    before: false,
                    after: true,
                },
            ],
        },
        ignores: ["**/node_modules/**", "**/build/**"],
    },
]);
