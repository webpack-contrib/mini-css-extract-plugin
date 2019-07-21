const Self = require('../../');

module.exports = {
  mode: 'development',
  output: {
    chunkFilename: '[contenthash].js',
    publicPath: '/dist/',
    crossOriginLoading: 'anonymous',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', Self.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new Self({
      filename: '[name].css',
      chunkFilename: '[contenthash].css',
      disableAsync({ module }) {
        let ret = false;
        if (module.content.indexOf('async-disabled') > -1) {
          ret = true;
        }
        return ret;
      },
    }),
  ],
  devServer: {
    contentBase: __dirname,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
