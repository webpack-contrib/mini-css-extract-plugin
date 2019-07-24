import Self from '../../../src';

module.exports = {
  entry: {
    index1: './index.js',
    index2: './index2.js',
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
      disableExtract({ isAsync }) {
        return isAsync;
      },
    }),
  ],
};
