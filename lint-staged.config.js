module.exports = {
  "*.js": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml,css,ts}": ["prettier --write"],
};
