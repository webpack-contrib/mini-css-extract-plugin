const Self = require('../../../');

module.exports = {
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          Self.loader,
          {
            loader: 'css-loader',
            options: {
              localIdentName: '[local]'
            }
          }
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
