const Self = require('../../../');

module.exports = {
  entry: {
   index: './index.js', 
   app: './app.js', 
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          Self.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new Self({
      filename: (chunk) => chunk == 'app' ? 'this.is.app.css' : '[name].css',
      chunkFilename: (chunk) => '[name].css',
    }),
  ],
};
