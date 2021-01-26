import Self from '../../../src';

module.exports = [1, 2].map(() => ({
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [Self.loader, 'css-loader'],
      },
    ],
  },
  output: {
    filename: `[name].js`,
  },
  plugins: [
    new Self({
      filename: `[name].[contenthash].css`,
      chunkFilename: `[name].[contenthash].css`,
    }),
  ],
  optimization: {
    runtimeChunk: true,
  },
}));
