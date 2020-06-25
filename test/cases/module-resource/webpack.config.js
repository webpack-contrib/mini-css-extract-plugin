import Self from '../../../src';

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
  plugins: [new Self()],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'all',
          enforce: true,
          test: (module) => {
            if (module.resource && module.resource.endsWith('a.css')) {
              return true;
            }
            return false;
          },
        },
      },
    },
  },
};
