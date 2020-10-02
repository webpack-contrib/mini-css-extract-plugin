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
      minSize: 0,
      chunks: 'all',
    },
  },
  plugins: [new Self()],
};
