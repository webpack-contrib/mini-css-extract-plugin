const webpack = require('webpack');

module.exports = () =>
  webpack.version[0] !== '4' && !process.env.EXPERIMENTAL_USE_IMPORT_MODULE;
