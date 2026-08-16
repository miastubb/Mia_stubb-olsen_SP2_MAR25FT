import js from "@eslint/js";

export default [
  {
    ignores: ["dist/**"],
  },

  js.configs.recommended,

  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        URL: "readonly",
        fetch: "readonly",
        document: "readonly",
        window: "readonly",
        console: "readonly",
      },
    },
  },
];
