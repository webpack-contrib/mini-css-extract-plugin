import path from 'path';

import webpack from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';

import MiniCssExtractPlugin from '../../src';

export default (fixture, loaderOptions = {}, config = {}) => {
  const { outputFileSystem, ...cnfg } = config;

  const fullConfig = {
    mode: 'development',
    devtool: cnfg.devtool || false,
    context: path.resolve(__dirname, '../fixtures'),
    entry: path.resolve(__dirname, '../fixtures', fixture),
    output: {
      path: path.resolve(__dirname, '../outputs'),
      filename: '[name].bundle.js',
      chunkFilename: '[name].chunk.js',
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          rules: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: loaderOptions || {},
            },
            {
              loader: 'css-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ],
    ...cnfg,
  };

  const compiler = webpack(fullConfig);

  if (!outputFileSystem) {
    const outputFS = createFsFromVolume(new Volume());
    // Todo remove when we drop webpack@4 support
    outputFS.join = path.join.bind(path);

    compiler.outputFileSystem = outputFS;
  } else {
    compiler.outputFileSystem = outputFileSystem;
  }

  return compiler;
};
