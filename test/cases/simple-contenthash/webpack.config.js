const Self = require('../../../');

module.exports = {
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          Self.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new Self({
      filename: '[name].[contenthash].css',
    }),
  ],
};
