import MiniCssExtractPlugin from '../src';

describe('Custom Attrs', () => {
  it('adds attrs', () => {
    const plugin = new MiniCssExtractPlugin({
      attrs: { 'my-attribute': 'my-value' },
    });

    const compiler = {
      hooks: {
        thisCompilation: {
          tap: (_pluginName, _callback) => {
            const compilation = {
              hooks: {
                normalModuleLoader: {
                  tap: () => {},
                },
                contentHash: {
                  tap: () => {},
                },
              },
              dependencyFactories: { set: () => {} },
              dependencyTemplates: { set: () => {} },
              mainTemplate: {
                getAssetPath: () => {},
                renderCurrentHashCode: () => '',
                outputOptions: { crossOriginLoading: false },
                hooks: {
                  renderManifest: { tap: () => {} },
                  hashForChunk: { tap: () => {} },
                  localVars: {
                    tap: () => {},
                  },
                  requireEnsure: {
                    tap: (pluginName, callback) => {
                      const source = '';
                      const chunk = {
                        getAllAsyncChunks: () => [
                          { modulesIterable: [{ type: 'css/mini-extract' }] },
                        ],
                        getChunkMaps: () => ({
                          hash: '',
                          contentHash: { 'css/mini-extract': {} },
                        }),
                      };
                      const hash = '';
                      const template = callback(source, chunk, hash);
                      expect(
                        template.indexOf(
                          'linkTag.setAttribute("my-attribute", "my-value");'
                        ) > -1
                      ).toBe(true);
                    },
                  },
                },
              },
              chunkTemplate: { hooks: { renderManifest: { tap: () => {} } } },
            };
            _callback(compilation);
          },
        },
      },
    };
    plugin.apply(compiler);
  });
});
