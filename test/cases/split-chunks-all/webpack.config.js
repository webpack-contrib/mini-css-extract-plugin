import webpack from 'webpack';

import Self from '../../../src';

module.exports = {
  entry: {
    a: './a.js',
    b: './b.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [Self.loader, 'css-loader'],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles:
          webpack.version[0] === '4'
            ? {
                chunks: 'all',
                enforce: true,
              }
            : {
                type: 'css/mini-extract',
                chunks: 'all',
                enforce: true,
              },
      },
    },
  },
  plugins: [new Self()],
};
