import Self from '../../../src';

module.exports = {
  entry: './index.js',
  output: {
    publicPath: 'auto',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: Self.loader,
            options: {},
          },
          'css-loader',
        ],
      },
      {
        test: /\.(svg|png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              filename: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new Self({
      filename: '[name].css',
    }),
  ],
};
