/**
 * @jest-environment node
 */

import path from 'path';

import webpack from 'webpack';
import del from 'del';

const fileSystemCacheDirectory = path.resolve(
  __dirname,
  './outputs/cache/type-filesystem'
);

del.sync(fileSystemCacheDirectory);

describe('TestCache', () => {
  it('should work without cache', async () => {
    if (webpack.version[0] !== '4') {
      const casesDirectory = path.resolve(__dirname, 'cases');
      const directoryForCase = path.resolve(casesDirectory, 'simple');
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const webpackConfig = require(path.resolve(
        directoryForCase,
        'webpack.config.js'
      ));

      const compiler1 = webpack({
        ...webpackConfig,
        mode: 'development',
        context: directoryForCase,
        cache: false,
      });

      await new Promise((resolve, reject) => {
        compiler1.run((error, stats) => {
          if (error) {
            reject(error);

            return;
          }

          expect(stats.compilation.warnings).toHaveLength(0);
          expect(stats.compilation.errors).toHaveLength(0);

          compiler1.close(() => {
            resolve();
          });
        });
      });

      const compiler2 = webpack({
        ...webpackConfig,
        mode: 'development',
        context: directoryForCase,
        cache: false,
      });

      await new Promise((resolve, reject) => {
        compiler2.run((error, stats) => {
          if (error) {
            reject(error);

            return;
          }

          expect(stats.compilation.warnings).toHaveLength(0);
          expect(stats.compilation.errors).toHaveLength(0);

          compiler2.close(() => {
            resolve();
          });
        });
      });
    } else {
      expect(true).toBe(true);
    }
  });

  it('should work with the "memory" cache', async () => {
    if (webpack.version[0] !== '4') {
      const casesDirectory = path.resolve(__dirname, 'cases');
      const directoryForCase = path.resolve(casesDirectory, 'simple');
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const webpackConfig = require(path.resolve(
        directoryForCase,
        'webpack.config.js'
      ));

      const compiler1 = webpack({
        ...webpackConfig,
        mode: 'development',
        context: directoryForCase,
        cache: {
          type: 'memory',
        },
      });

      await new Promise((resolve, reject) => {
        compiler1.run((error, stats) => {
          if (error) {
            reject(error);

            return;
          }

          expect(stats.compilation.warnings).toHaveLength(0);
          expect(stats.compilation.errors).toHaveLength(0);

          compiler1.close(() => {
            resolve();
          });
        });
      });

      const compiler2 = webpack({
        ...webpackConfig,
        mode: 'development',
        context: directoryForCase,
        cache: {
          type: 'memory',
        },
      });

      await new Promise((resolve, reject) => {
        compiler2.run((error, stats) => {
          if (error) {
            reject(error);

            return;
          }

          expect(stats.compilation.warnings).toHaveLength(0);
          expect(stats.compilation.errors).toHaveLength(0);

          compiler2.close(() => {
            resolve();
          });
        });
      });
    } else {
      expect(true).toBe(true);
    }
  });

  it('should work with the "filesystem" cache', async () => {
    if (webpack.version[0] !== '4') {
      const casesDirectory = path.resolve(__dirname, 'cases');
      const directoryForCase = path.resolve(casesDirectory, 'simple');
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const webpackConfig = require(path.resolve(
        directoryForCase,
        'webpack.config.js'
      ));

      const compiler1 = webpack({
        ...webpackConfig,
        mode: 'development',
        context: directoryForCase,
        cache: {
          type: 'filesystem',
          cacheDirectory: fileSystemCacheDirectory,
          idleTimeout: 0,
          idleTimeoutForInitialStore: 0,
        },
      });

      await new Promise((resolve, reject) => {
        compiler1.run((error, stats) => {
          if (error) {
            reject(error);

            return;
          }

          expect(stats.compilation.warnings).toHaveLength(0);
          expect(stats.compilation.errors).toHaveLength(0);

          compiler1.close(() => {
            resolve();
          });
        });
      });

      const compiler2 = webpack({
        ...webpackConfig,
        mode: 'development',
        context: directoryForCase,
        cache: {
          type: 'filesystem',
          cacheDirectory: fileSystemCacheDirectory,
          idleTimeout: 0,
          idleTimeoutForInitialStore: 0,
        },
      });

      await new Promise((resolve, reject) => {
        compiler2.run((error, stats) => {
          if (error) {
            reject(error);

            return;
          }

          expect(stats.compilation.warnings).toHaveLength(0);
          expect(stats.compilation.errors).toHaveLength(0);

          compiler2.close(() => {
            resolve();
          });
        });
      });
    } else {
      expect(true).toBe(true);
    }
  });
});
