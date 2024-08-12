import js from "@eslint/js"

export default {
    ...js.configs.recommended,
    ignores: ["**/dist/*"],
    rules: {
        indent: [
            "error",
            4,
            {
                SwitchCase: 1,
                ignoredNodes: ["ConditionalExpression"],
            },
        ],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double", { allowTemplateLiterals: true }],
        semi: ["error", "never"],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "no-inner-declarations": 0,
        "no-unused-vars": 0,
    },
}
