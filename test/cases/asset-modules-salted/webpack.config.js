import Self from '../../../src';

/**
 * Bug report:
 * Setting output.hashSalt together with optimization.realContentHash (e.g. prod mode)
 * results in wrong urls for asset-modules.
 */

module.exports = {
  entry: './index.js',
  output: {
    // if salt is omitted, the realContentHash value works in css
    hashSalt: 'i break things',
  },
  optimization: {
    // if this is disabled, filenames match even with hashSalt
    realContentHash: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [Self.loader, 'css-loader'],
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new Self({
      filename: '[name].css',
    }),
  ],
};
