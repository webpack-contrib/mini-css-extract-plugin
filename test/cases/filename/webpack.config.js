const Self = require('../../../');

module.exports = {
  entry: {
    'demo/js/main': './index.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [Self.loader, 'css-loader'],
      },
    ],
  },
  output: {
    filename: '[name].[chunkhash:8].js',
  },
  plugins: [
    new Self({
      filename: ({ name }) =>
        `${name.replace('/js/', '/css/')}.css`,
    }),
  ],
};
