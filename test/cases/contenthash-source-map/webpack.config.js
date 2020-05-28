import Self from '../../../src';

module.exports = [1, 2].map((n) => {
  return {
    entry: './index.js',
    devtool: 'source-map',
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
              options: {
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },
    output: {
      filename: `${n}.[name].js`,
    },
    resolve: {
      alias: {
        './style.css': `./style${n}.css`,
      },
    },
    plugins: [
      new Self({
        filename: `${n}.[name].[contenthash].css`,
      }),
    ],
  };
});
