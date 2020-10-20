import { version as webpackVersion } from 'webpack';

import Self from '../../../src';

function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  }

  // eslint-disable-next-line no-underscore-dangle
  const chunks = webpackVersion === '4' ? m._chunks : m.getChunks();

  for (const chunk of chunks) {
    return chunk.name;
  }

  return false;
}

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
        aStyles: {
          name: 'styles_a',
          test: (m, c, entry = 'a') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
        bStyles: {
          name: 'styles_b',
          test: (m, c, entry = 'b') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [new Self()],
};
