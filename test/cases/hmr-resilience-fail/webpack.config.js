import { HotModuleReplacementPlugin } from 'webpack';

import Self from '../../../src';

module.exports = {
  entry: './index.css',
  mode: 'development',
  devtool: false,
  // NOTE:
  // Using optimization settings to shunt everything
  // except the generated module code itself into
  // discarded chunks that won't be compared for
  // expected output.
  optimization: {
    runtimeChunk: 'single',
    namedModules: true,
    namedChunks: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]index\.css$/,
          name: 'check',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: Self.loader,
            options: {
              hmr: true,
            },
          },
          require.resolve('./error-loader'),
        ],
      },
    ],
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new Self({
      filename: '[name].css',
    }),
    {
      apply(compiler) {
        compiler.hooks.emit.tapAsync('no-emit', (compilation, callback) => {
          const { assets } = compilation;

          // Not interested in comparing output for these.
          delete assets['runtime.js'];
          delete assets['main.js'];

          callback();
        });
      },
    },
  ],
};
