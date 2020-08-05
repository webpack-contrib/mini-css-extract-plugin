import MiniCssExtractPlugin from '../src';

import { getCompiler, compile } from './helpers';

it('It should be able to inject successfully', async (done) => {
  class RewriteErrorHandler {
    // eslint-disable-next-line class-methods-use-this
    apply(compiler) {
      compiler.hooks.thisCompilation.tap(
        'RewriteErrorHandler',
        (compilation) => {
          compilation.hooks.miniCssExtractPluginBeforeLinkAppend.tap(
            'RewriteErrorHandler',
            (source, chunk, hash) => {
              expect(source).toBeDefined();
              expect(chunk).toBeDefined();
              expect(hash).toBeDefined();
              return 'head.onerror = console.error;';
            }
          );
        }
      );
    }
  }

  const compiler = getCompiler(
    './esmAsync.js',
    { esModule: true },
    {
      mode: 'production',
      optimization: { minimize: false },
      plugins: [
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id].css',
        }),
        new RewriteErrorHandler(),
      ],
    }
  );

  const stats = await compile(compiler);
  const content = stats.compilation.assets['main.bundle.js'].source();

  expect(stats.hasErrors()).toBe(false);
  expect(content).toMatchSnapshot();

  done();
});
