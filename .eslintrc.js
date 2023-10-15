module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier",
    "next/core-web-vitals",
    "plugin:@next/next/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "import"],
  rules: {
    "no-undef": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-multi-spaces": ["error"],
    "no-multiple-empty-lines": ["error"],
    "@typescript-eslint/no-explicit-any": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [1, { extensions: [".ts", ".tsx"] }],
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-unused-vars": "error",
  },
};
