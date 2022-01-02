/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  extends: [
    "next",
    "next/core-web-vitals",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "prettier",
  ],
  plugins: ["unused-imports", "jest"],
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  settings: {
    next: {
      rootDir: [
        "apps/home/",
        "packages/ui/",
        "packages/config/",
        "packages/tsconfig/",
      ],
    },
  },
  rules: {
    "react/function-component-definition": [
      2,
      {
        namedComponents: "function-declaration",
      },
    ],
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "jsx-a11y/alt-text": [
      2,
      {
        elements: ["img", "object", "area", 'input[type="image"]'],
        img: [],
        object: ["Object"],
        area: ["Area"],
        'input[type="image"]': ["InputImage"],
      },
    ],
  },
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
