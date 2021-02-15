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
  output: {
    module: true,
    iife: false,
  },
  experiments: {
    outputModule: true,
  },
  plugins: [
    new Self({
      filename: '[name].css',
    }),
  ],
};
