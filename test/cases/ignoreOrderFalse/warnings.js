const cssLoaderPath = require.resolve('css-loader').replace(/\\/g, '/');

module.exports = [
  '',
  'WARNING in chunk styles [mini-css-extract-plugin]',
  'Following module has been added:',
  ` * css ${cssLoaderPath}!./e2.css`,
  "while this module as dependencies that haven't been added before:",
  ` * css ${cssLoaderPath}!./e1.css (used previous to added module in chunk entry2)`,
].join('\n');
