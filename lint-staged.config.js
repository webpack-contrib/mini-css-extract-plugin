module.exports = {
  "*": ["prettier --write --ignore-unknown", "cspell --no-must-find-files"],
  "*.{js,ts}": ["eslint --cache --fix"],
};
