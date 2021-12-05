module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': ["error", {
      "anonymous": "always",
      "named": "never",
      "asyncArrow": "always"
    }],
    // 'keyword-spacing': ["error", { "after": false }],
    'keyword-spacing': ["error", { "overrides": {
      "if": { "after": false },
      "for": { "after": false },
      "while": { "after": false }
    } }],
    'eqeqeq': 0,
    'prefer-const': 0,
    'camelcase': 0
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
