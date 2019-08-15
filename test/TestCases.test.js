import fs from 'fs';
import path from 'path';

import webpack from 'webpack';

function compareDirectory(actual, expected) {
  const files = fs.readdirSync(expected);

  for (const file of files) {
    const absoluteFilePath = path.resolve(expected, file);

    const stats = fs.lstatSync(absoluteFilePath);

    if (stats.isDirectory()) {
      compareDirectory(
        path.resolve(actual, file),
        path.resolve(expected, file)
      );
    } else if (stats.isFile()) {
      const content = fs.readFileSync(path.resolve(expected, file), 'utf8');
      const actualContent = fs.readFileSync(path.resolve(actual, file), 'utf8');

      expect(actualContent).toEqual(content);
    }
  }
}

describe('TestCases', () => {
  const casesDirectory = path.resolve(__dirname, 'cases');
  const outputDirectory = path.resolve(__dirname, 'js');

  // The ~hmr-resilience testcase has a few variable components in its
  // output. To resolve these and make the output predictible and comparable:
  // - it needs Date.now to be mocked to a constant value.
  // - it needs JSON.stringify to be mocked to strip source location path
  //   out of a stringified error.
  let dateNowMock = null;
  let jsonStringifyMock = null;
  beforeEach(() => {
    dateNowMock = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => 1479427200000);

    const stringify = JSON.stringify.bind(JSON);
    jsonStringifyMock = jest
      .spyOn(JSON, 'stringify')
      .mockImplementation((value) => {
        // ~hmr-resilience testcase. Need to erase stack trace location,
        // which varies by system and cannot be compared.
        if (typeof value === 'string' && value.includes('error-loader.js')) {
          return stringify(
            value.replace(
              /\([^(]+error-loader\.js:\d+:\d+\)$/,
              '(error-loader.js:1:1)'
            )
          );
        }

        return stringify(value);
      });
  });

  afterEach(() => {
    dateNowMock.mockRestore();
    jsonStringifyMock.mockRestore();
  });

  for (const directory of fs.readdirSync(casesDirectory)) {
    if (!/^(\.|_)/.test(directory)) {
      const expectsError = /-fail$/.test(directory);

      // eslint-disable-next-line no-loop-func
      it(`${directory} should compile to the expected result`, (done) => {
        const directoryForCase = path.resolve(casesDirectory, directory);
        const outputDirectoryForCase = path.resolve(outputDirectory, directory);
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const webpackConfig = require(path.resolve(
          directoryForCase,
          'webpack.config.js'
        ));

        for (const config of [].concat(webpackConfig)) {
          Object.assign(
            config,
            {
              mode: 'none',
              context: directoryForCase,
              output: Object.assign(
                {
                  path: outputDirectoryForCase,
                },
                config.output
              ),
            },
            config
          );
        }

        webpack(webpackConfig, (err, stats) => {
          if (err && !expectsError) {
            done(err);
            return;
          }

          done();

          // eslint-disable-next-line no-console
          console.log(
            stats.toString({
              context: path.resolve(__dirname, '..'),
              chunks: true,
              chunkModules: true,
              modules: false,
            })
          );

          if (stats.hasErrors() && !expectsError) {
            done(
              new Error(
                stats.toString({
                  context: path.resolve(__dirname, '..'),
                  errorDetails: true,
                })
              )
            );

            return;
          }

          const expectedDirectory = path.resolve(directoryForCase, 'expected');

          compareDirectory(outputDirectoryForCase, expectedDirectory);

          done();
        });
      }, 10000);
    }
  }
});
