const Self = require('../../../');

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
  plugins: [
    new Self({
      filename: '[name].css',
      onEmit: function(chunk, modules) {
        if (chunk.name !== 'main') {
          throw new Error('Chunk object was not passed correctly');
        }
        return new Set(Array.from(modules).reverse());
      },
    }),
  ],
};
