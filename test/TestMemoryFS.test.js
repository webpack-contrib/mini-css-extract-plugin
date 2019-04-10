import path from 'path';

import MemoryFS from 'memory-fs';
import webpack from 'webpack';

const assetsNames = (json) => json.assets.map((asset) => asset.name);

describe('TestMemoryFS', () => {
  it('should preserve asset even if not emitted', (done) => {
    const casesDirectory = path.resolve(__dirname, 'cases');
    const directoryForCase = path.resolve(casesDirectory, 'simple-publicpath');
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const webpackConfig = require(path.resolve(
      directoryForCase,
      'webpack.config.js'
    ));
    const compiler = webpack({
      ...webpackConfig,
      mode: 'development',
      context: directoryForCase,
      cache: false,
    });
    compiler.outputFileSystem = new MemoryFS();
    compiler.run((err1, stats1) => {
      if (err1) {
        done(err1);
        return;
      }
      compiler.run((err2, stats2) => {
        if (err2) {
          done(err2);
          return;
        }
        expect(assetsNames(stats1.toJson())).toEqual(
          assetsNames(stats2.toJson())
        );
        done();
      });
    });
  });
});
