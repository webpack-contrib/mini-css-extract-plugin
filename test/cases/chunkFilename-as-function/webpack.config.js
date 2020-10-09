import { version as webpackVersion } from 'webpack';

import Self from '../../../src';

module.exports = {
  entry: './index.js',
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
      chunkFilename:
        webpackVersion[0] === '4'
          ? '[id].[name].css'
          : ({ chunk }) => `${chunk.id}.${chunk.name}.css`,
    }),
  ],
};
