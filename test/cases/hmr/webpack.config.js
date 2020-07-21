import webpack from 'webpack';

import Self from '../../../src';

module.exports = {
  entry: './index.css',
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
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new Self({
      filename: '[name].css',
    }),
  ],
};
