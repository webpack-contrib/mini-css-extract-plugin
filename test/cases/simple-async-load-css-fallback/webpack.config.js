import Self from '../../../src';

module.exports = {
  entry: {
    'main': './index.js',
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
    function() {
      this.hooks.compilation.tap("Test", compilation => {
        compilation.hooks.beforeChunkAssets.tap("Test", () => {
          for (const chunkGroup of compilation.chunkGroups) {
            // remove getModuleIndex2 to enforce using fallback
            chunkGroup.getModuleIndex2 = undefined;
          }
        });
      })
    },
    new Self({
      filename: '[name].css',
    }),
  ],
};
