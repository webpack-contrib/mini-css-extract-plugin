/* eslint-disable no-console */

const pathlib = require('path');
const fs = require('fs');
const crypto = require('crypto');

const del = require('del');

const webpack = require('webpack');

const config = require('./webpack.config');

const randomId = () => crypto.randomBytes(16).toString('hex');
const createModule = (deps = []) => {
  const id = randomId();
  const cssPath = pathlib.resolve(__dirname, `src/tmp/${id}.css`);
  const jsPath = pathlib.resolve(__dirname, `src/tmp/${id}.js`);
  const cssContent = `.c-${id} { display: block; }`;
  const jsContent = [...deps.filter(Boolean), cssPath]
    .map((p) => `import '${p}';`)
    .join('\n');
  fs.writeFileSync(cssPath, cssContent);
  fs.writeFileSync(jsPath, jsContent);
  return jsPath;
};

const distPath = pathlib.resolve(__dirname, 'dist');
const tmpPath = pathlib.resolve(__dirname, 'src/tmp');

del.sync(distPath);
del.sync(tmpPath);
fs.mkdirSync(tmpPath);

const SIZE = 100;
const DEPTH = 80;

console.log(`Preparing ${SIZE}x${DEPTH} data...`);

const indexSrc = Array.from({ length: SIZE })
  .map(() =>
    Array.from({ length: DEPTH }).reduce((prev) => createModule([prev]), null)
  )
  .map((p) => `import '${p}';`)
  .join('\n');

fs.writeFileSync(pathlib.resolve(__dirname, `src/tmp/index.js`), indexSrc);

console.log(`Running Webpack...`);

webpack(config).run((err, stats) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(
    stats.toString({
      all: false,
      colors: true,
      builtAt: true,
      env: true,
      hash: true,
      timings: true,
      version: true,
      modules: true,
      maxModules: 0,
      errors: true,
      errorDetails: true,
      warnings: true,
      moduleTrace: true,
      assets: true,
      entrypoints: true,
      performance: true,
    })
  );
});
