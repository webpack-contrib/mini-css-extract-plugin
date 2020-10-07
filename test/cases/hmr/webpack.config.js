import { HotModuleReplacementPlugin } from 'webpack';

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
          },
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new Self({
      filename: '[name].css',
    }),
  ],
};
