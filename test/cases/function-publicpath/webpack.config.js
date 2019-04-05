const Self = require('../../../');
const path = require('path')

module.exports = {
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: Self.loader,
            options: {
              publicPath: (resourcePath, context) => path.relative(path.dirname(resourcePath), context) + '/',
            }
          },
          'css-loader',
        ],
      }, {
        test: /\.(svg|png)$/,
        use: [{
          loader: 'file-loader',
          options: {
            filename: '[name].[ext]'
          }
        }]
      }
    ],
  },
  plugins: [
    new Self({
      filename: '[name].css',
    }),
  ],
};
