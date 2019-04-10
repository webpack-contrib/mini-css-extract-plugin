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
            options: {
              hmr: true,
            },
          },
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new Self({
      filename: '[name].css',
    }),
  ],
};
