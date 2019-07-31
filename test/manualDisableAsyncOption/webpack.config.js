const Self = require('../../');

module.exports = {
  mode: 'development',
  output: {
    chunkFilename: '[name].js',
    publicPath: '/dist/',
    crossOriginLoading: 'anonymous',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        a: {
          name: 'a',
          test: /a.css/,
          chunks: 'all',
          enforce: true,
        },
        b: {
          name: 'b',
          test: /b.css/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [Self.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new Self({
      filename: '[name].css',
    }),
  ],
  devServer: {
    contentBase: __dirname,
  },
};
