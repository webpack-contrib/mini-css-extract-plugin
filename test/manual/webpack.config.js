const Self = require('../../');

const ENABLE_HMR =
  typeof process.env.ENABLE_HMR !== 'undefined'
    ? Boolean(process.env.ENABLE_HMR)
    : false;

const ENABLE_ES_MODULE =
  typeof process.env.ES_MODULE !== 'undefined'
    ? Boolean(process.env.ES_MODULE)
    : false;

module.exports = {
  mode: 'development',
  devtool: 'cheap-source-map',
  output: {
    chunkFilename: '[contenthash].js',
    publicPath: '/dist/',
    crossOriginLoading: 'anonymous',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: [/\.module\.css$/i],
        use: [
          {
            loader : 'style-loader',
          },
          {
            loader: Self.loader,
            options: {
              hmr: ENABLE_HMR,
            },
          },
          {
            loader: 'css-loader',
            options: {
              esModule: ENABLE_ES_MODULE,
            },
          },
        ],
      },
      {
        test: /\.module\.css$/i,
        use: [
          {
            loader: Self.loader,
            options: {
              hmr: ENABLE_HMR,
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              esModule: ENABLE_ES_MODULE,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new Self({
      filename: '[name].css',
      chunkFilename: '[contenthash].css',
      disableExtract({ module }) {
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
