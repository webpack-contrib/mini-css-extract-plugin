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
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          enforce: true
        }
      }
    }
  },
  plugins: [
    new Self({
      filename: '[name].css',
      minSize: 50
    }),
  ],
};
