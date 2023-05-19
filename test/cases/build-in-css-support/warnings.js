module.exports = [
  "WARNING in css ./style.css",
  "Module Warning (from ../../../node_modules/css-loader/dist/cjs.js):",
  'You can\'t use `experiments.css` (`experiments.futureDefaults` enable built-in CSS support by default) and `css-loader` together, please set `experiments.css` to `false` or set `{ type: "javascript/auto" }` for rules with `css-loader` in your webpack config (now css-loader does nothing).',
  "",
  "WARNING in css ./style.css",
  "Module Warning (from ../../../src/loader.js):",
  'You can\'t use `experiments.css` (`experiments.futureDefaults` enable built-in CSS support by default) and `mini-css-extract-plugin` together, please set `experiments.css` to `false` or set `{ type: "javascript/auto" }` for rules with `mini-css-extract-plugin` in your webpack config (now `mini-css-extract-plugin` does nothing).',
].join("\n");
