import { HotModuleReplacementPlugin, version } from 'webpack';

import Self from '../../../src';

module.exports = {
  entry: './index.css',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          version.startsWith('4')
            ? {
                loader: Self.loader,
                options: {
                  hmr: true,
                },
              }
            : {
                loader: Self.loader,
              },
          'css-loader',
        ],
      },
    ],
  },
  plugins: version.startsWith('4')
    ? [
        new Self({
          filename: '[name].css',
        }),
      ]
    : [
        new HotModuleReplacementPlugin(),
        new Self({
          filename: '[name].css',
        }),
      ],
};
