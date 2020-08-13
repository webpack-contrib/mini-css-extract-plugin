import webpack from 'webpack';

import { getCompiler, source, compile } from './helpers';

const isWebpack5 = webpack.version[0] === '5';

it('should enforce esm for empty module with options.esModule', async (done) => {
  const compiler = getCompiler(
    './esm.js',
    { esModule: true },
    {
      mode: 'production',
      optimization: { minimize: false },
    }
  );
  const stats = await compile(compiler);
  expect(stats.hasErrors()).toBe(false);
  expect(stats.compilation.modules.length).toBe(isWebpack5 ? 4 : 2);
  expect(source('./simple.css', stats)).toMatchInlineSnapshot(`
    "// extracted by mini-css-extract-plugin
    export {};"
  `);
  done();
});

it('should keep empty module without options.esModule', async (done) => {
  const compiler = getCompiler(
    './esm.js',
    {},
    {
      mode: 'production',
      optimization: { minimize: false },
    }
  );
  const stats = await compile(compiler);
  expect(stats.hasErrors()).toBe(false);
  expect(stats.compilation.modules.length).toBe(isWebpack5 ? 7 : 3);
  expect(source('./simple.css', stats)).toMatchInlineSnapshot(
    `"// extracted by mini-css-extract-plugin"`
  );
  done();
});
