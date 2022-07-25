module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/no-floating-promises": "off",
    // "@typescript-eslint/no-explicit-any": "off",
    // "@typescript-eslint/explicit-module-boundary-types": "off",
    // "@typescript-eslint/restrict-template-expressions": "off",
    // "@typescript-eslint/no-var-requires": "off",
    // "@typescript-eslint/no-unsafe-call": "off",
    // "@typescript-eslint/no-unsafe-assignment": "off",
    // "@typescript-eslint/no-unsafe-member-access": "off",
    // "@typescript-eslint/restrict-plus-operands": "off",
    // "@typescript-eslint/require-await": "off",
    // "@typescript-eslint/no-empty-function": "off",
    // "no-constant-condition": "off",
    // "@typescript-eslint/unbound-method": "off",
    // "react/no-unescaped-entities": "off",
    // "@typescript-eslint/no-unsafe-return": "off",
    // "no-extra-boolean-cast": "off",
    // "no-useless-escape": "off",
    // "@typescript-eslint/no-this-alias": [
    //     "error",
    //     {
    //         allowDestructuring: true,
    //         allowedNames: ["self", "_that", "that"],
    //     },
    // ],
    // "@typescript-eslint/no-misused-promises": [
    //     "error",
    //     {
    //         checksVoidReturn: false,
    //     },
    // ],
  },
  parserOptions: {
    project: "./tsconfig.json",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
}
