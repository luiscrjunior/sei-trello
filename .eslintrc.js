module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react-hooks'],
  rules: {
    'react/prop-types': 0,
    'react/no-find-dom-node': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  globals: {
    chrome: true,
    PRODUCTION: true,
    DEVELOPMENT: true,
  },
};
