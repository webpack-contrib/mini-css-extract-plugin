/**
 * @jest-environment node
 */

import path from 'path';

import webpack from 'webpack';
import del from 'del';

describe('TestCache', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should work without cache', async () => {
    if (webpack.version[0] !== '4') {
      const originalRegister = webpack.util.serialization.register;

      webpack.util.serialization.register = jest
        .fn()
        .mockImplementation((...args) => {
          if (args[1].startsWith('mini-css-extract-plugin')) {
            // eslint-disable-next-line no-param-reassign
            args[1] = args[1].replace(/dist/, 'src');

            return originalRegister(...args);
          }

          return originalRegister(...args);
        });

      const casesDirectory = path.resolve(__dirname, 'cases');
      const directoryForCase = path.resolve(casesDirectory, 'simple');
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const webpackConfig = require(path.resolve(
        directoryForCase,
        'webpack.config.js'
      ));
      const outputPath = path.resolve(__dirname, 'js/cache-false');

      await del([outputPath]);

      const compiler1 = webpack({
        ...webpackConfig,
        mode: 'development',
        context: directoryForCase,
        cache: false,
        output: {
          path: outputPath,
        },
      });

      await new Promise((resolve, reject) => {
        compiler1.run((error, stats) => {
          if (error) {
            reject(error);

            return;
          }

          expect(stats.compilation.emittedAssets.size).toBe(2);
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
        output: {
          path: outputPath,
        },
      });

      await new Promise((resolve, reject) => {
        compiler2.run((error, stats) => {
          if (error) {
            reject(error);

            return;
          }

          // Because webpack compare the source content before emitting
          expect(stats.compilation.emittedAssets.size).toBe(0);
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
      const originalRegister = webpack.util.serialization.register;

      webpack.util.serialization.register = jest
        .fn()
        .mockImplementation((...args) => {
          if (args[1].startsWith('mini-css-extract-plugin')) {
            // eslint-disable-next-line no-param-reassign
            args[1] = args[1].replace(/dist/, 'src');

            return originalRegister(...args);
          }

          return originalRegister(...args);
        });

      const casesDirectory = path.resolve(__dirname, 'cases');
      const directoryForCase = path.resolve(casesDirectory, 'simple');
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const webpackConfig = require(path.resolve(
        directoryForCase,
        'webpack.config.js'
      ));
      const outputPath = path.resolve(__dirname, 'js/cache-memory');

      await del([outputPath]);

      const compiler1 = webpack({
        ...webpackConfig,
        mode: 'development',
        context: directoryForCase,
        cache: {
          type: 'memory',
        },
        output: {
          path: outputPath,
        },
      });

      await new Promise((resolve, reject) => {
        compiler1.run((error, stats) => {
          if (error) {
            reject(error);

            return;
          }

          expect(stats.compilation.emittedAssets.size).toBe(2);
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
        output: {
          path: outputPath,
        },
      });

      await new Promise((resolve, reject) => {
        compiler2.run((error, stats) => {
          if (error) {
            reject(error);

            return;
          }

          expect(stats.compilation.emittedAssets.size).toBe(0);
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
      const originalRegister = webpack.util.serialization.register;

      webpack.util.serialization.register = jest
        .fn()
        .mockImplementation((...args) => {
          if (args[1].startsWith('mini-css-extract-plugin')) {
            // eslint-disable-next-line no-param-reassign
            args[1] = args[1].replace(/dist/, 'src');

            return originalRegister(...args);
          }

          return originalRegister(...args);
        });

      const casesDirectory = path.resolve(__dirname, 'cases');
      const directoryForCase = path.resolve(casesDirectory, 'simple');
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const webpackConfig = require(path.resolve(
        directoryForCase,
        'webpack.config.js'
      ));
      const outputPath = path.resolve(__dirname, 'js/cache-filesystem');
      const fileSystemCacheDirectory = path.resolve(
        __dirname,
        './js/.cache/type-filesystem'
      );

      await del([outputPath, fileSystemCacheDirectory]);

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
        output: {
          path: outputPath,
        },
      });

      await new Promise((resolve, reject) => {
        compiler1.run((error, stats) => {
          if (error) {
            reject(error);

            return;
          }

          expect(stats.compilation.emittedAssets.size).toBe(2);
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
        output: {
          path: outputPath,
        },
      });

      await new Promise((resolve, reject) => {
        compiler2.run((error, stats) => {
          if (error) {
            reject(error);

            return;
          }

          expect(stats.compilation.emittedAssets.size).toBe(0);
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
