module.exports = {
  root: true,
  parser: 'babel-eslint',
  plugins: ['prettier'],
  extends: ['@webpack-contrib/eslint-config-webpack'],
  rules: {
    'prettier/prettier': ['error'],
  },
};
