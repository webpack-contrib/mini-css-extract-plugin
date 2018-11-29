const Self = require('../../../');

module.exports = [1, 2].map((n) => {
  return {
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
    resolve: {
      alias: {
        './style.css': `./style${n}.css`,
      },
    },
    plugins: [
      new Self({
        filename: ({ name, chunkhash }) =>
          `${name.replace('/js/', '/css/')}.${chunkhash.substring(0, 8)}.css`,
      }),
    ],
  };
});
