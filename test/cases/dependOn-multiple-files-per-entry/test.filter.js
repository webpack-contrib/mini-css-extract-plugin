const webpack = require('webpack');

module.exports = () => {
  return webpack.version[0] !== '4';
};
