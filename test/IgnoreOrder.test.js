import path from 'path';
import webpack from 'webpack';

describe('IgnoreOrder', () => {
  it('should emit warnings', (done) => {
    const casesDirectory = path.resolve(__dirname, 'cases');
    const directoryForCase = path.resolve(casesDirectory, 'ignoreOrderFalse');
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
    compiler.run((err1, stats) => {
      expect(stats.hasWarnings()).toBeTruthy();
      done();
    });
  });

  it('should not emit warnings', (done) => {
    const casesDirectory = path.resolve(__dirname, 'cases');
    const directoryForCase = path.resolve(casesDirectory, 'ignoreOrder');
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
    compiler.run((err1, stats) => {
      expect(stats.hasWarnings()).toBeFalsy();
      done();
    });
  });
});
