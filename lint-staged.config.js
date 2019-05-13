module.exports = {
  ignore: ['package-lock.json'],
  linters: {
    '*.js': ['eslint --fix', 'git add'],
  },
};
