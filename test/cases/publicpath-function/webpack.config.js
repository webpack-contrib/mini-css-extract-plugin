const Self = require('../../../');
const path = require('path')

module.exports = {
  entry: {
    // Specific CSS entry point, with output to a nested folder
    'nested/style': './nested/style.css',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: Self.loader,
            options: {
              // Compute publicPath relative to the CSS output
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
