/* globals document, getComputedStyle */

import path from 'path';

import webpack from 'webpack';

import config from './webpack.config';

describe('options.insert as a function', () => {
  it('inserts the bundle on the page', (done) => {
    const outputPath = path.resolve(__dirname, 'expected/index.js');
    webpack({
      ...config,
      output: {
        path: outputPath,
        libraryTarget: 'umd',
        library: 'mini',
      },
    }).run(() => {
      let computedValue = getComputedStyle(document.body).backgroundColor;
      expect(computedValue).toBe('');

      const script = document.createElement('script');
      script.src = outputPath;
      document.head.appendChild(script);

      computedValue = getComputedStyle(document.body).backgroundColor;
      expect(computedValue).toBe('rgba(0, 0, 0, 0)');

      done();
    });
  });
});
