import path from 'path';

import webpack from 'webpack';

describe('EsModules', () => {
  it('should generate ES6 modules', (done) => {
    const casesDirectory = path.resolve(__dirname, 'cases');
    const directoryForCase = path.resolve(casesDirectory, 'esModules');
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
      const { modules } = stats.toJson();
      let foundModule = false;
      modules.forEach((module) => {
        if (module.name === './style.css') {
          foundModule = true;
          expect(module.source).toMatchSnapshot();
        }
      });
      expect(foundModule).toBe(true);
      done();
    });
  });
});
