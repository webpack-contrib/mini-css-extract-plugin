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
    filename: '[name].js',
  },
  plugins: [
    new Self({
      filenameTemplate: ({ chunk }) =>
        `${chunk.name.replace('/js/', '/css/')}.css`,
    }),
  ],
};
