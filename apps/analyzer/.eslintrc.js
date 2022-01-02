/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  extends: ["eslint:recommended", "prettier"],
  env: {
    es2021: true,
    node: true,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  rules: {},
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      plugins: ["@typescript-eslint"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
      extends: ["plugin:@typescript-eslint/recommended", "prettier"],
      rules: {
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": ["error"],
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": ["error"],
        "react/require-default-props": "off",
        "@typescript-eslint/no-floating-promises": ["error"],
        "no-void": ["error", { allowAsStatement: true }],
        "@typescript-eslint/no-unused-vars": [
          "warn",
          { argsIgnorePattern: "^_" },
        ],
      },
    },
  ],
};
