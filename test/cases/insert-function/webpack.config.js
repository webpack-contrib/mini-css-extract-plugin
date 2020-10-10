/* global document */

const Self = require('../../../src/cjs');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: Self.loader,
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new Self({
      filename: '[name].css',
      chunkFilename: '[id].css',
      insert: function insert(linkTag) {
        const reference = document.querySelector('.hot-reload');
        if (reference) {
          reference.parentNode.insertBefore(linkTag, reference);
        }
      },
    }),
  ],
};
