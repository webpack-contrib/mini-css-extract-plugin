import path from 'path';

import del from 'del';

import Self from '../../../src';

const fileSystemCacheDirectory = path.resolve(
  __dirname,
  '../../outputs/cache/type-filesystem'
);

del.sync(fileSystemCacheDirectory);

module.exports = {
  entry: './index.js',
  cache: {
    type: 'filesystem',
    cacheDirectory: fileSystemCacheDirectory,
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
};
