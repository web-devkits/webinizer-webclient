module.exports = {
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:vue/vue3-recommended",
    "prettier",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: {
      ts: "@typescript-eslint/parser",
    },
    project: ["./tsconfig.json"],
    extraFileExtensions: [".vue"],
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": 2,
    "@typescript-eslint/no-explicit-any": ["error", { ignoreRestArgs: true }],
    "vue/require-default-prop": "off",
    "vue/multi-word-component-names": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-empty-object-type":"off",
  },
};
