const MIN_BABEL_VERSION = 7;

module.exports = (api) => {
  api.assertVersion(MIN_BABEL_VERSION);
  api.cache(true);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: '6.9.0',
          },
        },
      ],
    ],
    overrides: [
      {
        test: '**/hmr/**/*.js',
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                node: '0.12',
              },
            },
          ],
        ],
      },
    ],
  };
};
