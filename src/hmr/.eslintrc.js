module.exports = {
  "parserOptions": {
    "ecmaVersion": 5,
    "sourceType": "module",
  },
  globals: {
    document: true
  },
  plugins: ['prettier'],
  extends: ['@webpack-contrib/eslint-config-webpack'],
  rules: {
    'prettier/prettier': [
      'error',
      {singleQuote: true, trailingComma: 'es5', arrowParens: 'avoid'},
    ],
    'class-methods-use-this': 'off',
    'no-undefined': 'off',
    'func-style': ["error", "declaration", {"allowArrowFunctions": false}],
    'prefer-rest-params': 0,
    'prefer-spread': 0,
    'prefer-destructuring': 0
  },
};
