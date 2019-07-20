import Self from '../../../src';

module.exports = {
  entry: {
    index1: './index.js',
    index2: './index2.js',
  },
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
      filename: '[name]-[contenthash].css',
      disableAsync({ module }) {
        let ret = false;
        if (
          module.content.indexOf('in-async ') > -1 ||
          module.content.indexOf('both-page-async-disabled') > -1
        ) {
          ret = true;
        }
        return ret;
      },
    }),
  ],
};
