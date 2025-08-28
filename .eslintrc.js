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
    'no-console': ['warn', { allow: ['warn','error'] }]
  }
};