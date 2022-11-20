module.exports = {
  "*": ["prettier --write --ignore-unknown", "cspell"],
  "*.{js,ts}": ["eslint --cache --fix"],
};
