const webpack = require('webpack');

module.exports = () => webpack.version[0] !== '4';
