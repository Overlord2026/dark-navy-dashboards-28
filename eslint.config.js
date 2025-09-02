import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      // Analytics guardrails - prevent 3+ arg calls that caused TS issues
      "no-restricted-imports": ["error", { 
        "paths": [
          { 
            "name": "@supabase/supabase-js", 
            "importNames": ["createClient"], 
            "message": "Use src/lib/supabaseClient.ts only." 
          }
        ]
      }],
      "no-restricted-syntax": [
        "error",
        {
          "selector": "CallExpression[callee.object.name='analytics'][callee.property.name='track'][arguments.length>2]",
          "message": "analytics.track only accepts (event, props?). Remove extra positional args."
        },
        {
          "selector": "CallExpression[callee.object.name='localStorage'][callee.property.name='setItem']",
          "message": "Avoid storing sensitive data in localStorage. Use Supabase auth state for sessions."
        },
        {
          "selector": "CallExpression[callee.object.name='sessionStorage'][callee.property.name='setItem']",
          "message": "Review sessionStorage usage. Consider memory-only storage for sensitive data."
        },
        { 
          "selector": "Literal[value=/service_role|SUPABASE_SERVICE_ROLE_KEY|sk_live|api_secret/i]", 
          "message": "Secrets are not allowed in client code." 
        }
      ],
      // A11y specific rules
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/heading-has-content": "error",
      "jsx-a11y/img-redundant-alt": "error",
      "jsx-a11y/interactive-supports-focus": "error",
      "jsx-a11y/label-has-associated-control": "error",
      "jsx-a11y/mouse-events-have-key-events": "error",
      "jsx-a11y/no-access-key": "error",
      "jsx-a11y/no-autofocus": "warn",
      "jsx-a11y/no-redundant-roles": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",
    },
  }
);
