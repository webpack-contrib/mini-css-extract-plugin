const Self = require('../../../');

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
              publicPath: '/static/img/'
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
