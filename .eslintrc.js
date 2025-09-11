module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: 'CallExpression[callee.object.name="localStorage"][callee.property.name="setItem"]',
        message: 'Do not store sensitive data in localStorage.',
      },
      {
        selector: 'CallExpression[callee.object.name="sessionStorage"][callee.property.name="setItem"]',
        message: 'Do not store sensitive data in sessionStorage.',
      }
    ],
    'no-console': ['warn', { allow: ['warn','error'] }],
    'no-restricted-imports': ['error', {
      'paths': [{
        'name': '@/lib/canonical',
        'importNames': ['canonicalize','inputsHash','inputs_hash','hash','sha256Hex','canonicalJson','stableStringify'],
        'message': 'Use: import * as Canonical from "@/lib/canonical"; then Canonical.fn(...). Type-only named imports are allowed.'
      }]
    }]
  }
};