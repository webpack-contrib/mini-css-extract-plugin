const pathlib = require('path');

const Self = require('../../');

const config = (mode) => {
  return {
    mode,
    name: mode,
    entry: pathlib.resolve(__dirname, 'src/index.js'),
    output: {
      filename: `${mode}.js`,
      path: pathlib.resolve(__dirname, 'dist'),
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
        filename: `[name]-${mode}.css`,
      }),
    ],
  };
};

module.exports = [config('development'), config('production')];
