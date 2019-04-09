const Self = require('../../../');

module.exports = [1, 2].map(n => ({
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: Self.loader,
            options:{
              hmr: false
            }
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          {
            loader: './loader',
            ident: 'my-loader',
            options: {
              number: n
            }
          }
        ],
      },
    ],
  },
  output: {
    filename: `[name].[contenthash].js`
  },
  plugins: [
    new Self({
      filename: `[name].[chunkhash].css`,
    }),
  ],
}));
