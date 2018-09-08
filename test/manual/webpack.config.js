const Self = require('../../');

module.exports = {
  mode: 'development',
  output: {
    chunkFilename: "[contenthash].js",
    publicPath: '/dist/',
  },
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
      filename: '[name].css',
      chunkFilename: "[contenthash].css",
      minSize: 30,
    }),
  ],
  devServer: {
    contentBase: __dirname,
  },
};
