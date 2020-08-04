import { getCompiler, source, compile } from './helpers';

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
  expect(source('./simple.css', stats)).toMatchInlineSnapshot(
    `"// extracted by mini-css-extract-plugin"`
  );
  done();
});
