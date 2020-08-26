module.exports = {
  '*.js': ['prettier --write', 'eslint --fix', 'git add'],
  '*.{json,md,yml,css,ts}': ['prettier --write', 'git add'],
};
