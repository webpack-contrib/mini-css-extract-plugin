/**
 * @jest-environment node
 */

import fs from 'fs';
import path from 'path';

import webpack from 'webpack';

function clearDirectory(dirPath) {
  let files;

  try {
    files = fs.readdirSync(dirPath);
  } catch (e) {
    return;
  }
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const filePath = `${dirPath}/${files[i]}`;

      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      } else {
        clearDirectory(filePath);
      }
    }
  }

  fs.rmdirSync(dirPath);
}

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
      let actualContent;

      if (/^MISSING/.test(content)) {
        expect(fs.existsSync(path.resolve(actual, file))).toBe(false);
      } else {
        try {
          actualContent = fs.readFileSync(path.resolve(actual, file), 'utf8');
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error);

          const dir = fs.readdirSync(actual);

          // eslint-disable-next-line no-console
          console.log({ [actual]: dir });
        }

        expect(actualContent).toEqual(content);
      }
    }
  }
}

describe('TestCases', () => {
  const casesDirectory = path.resolve(__dirname, 'cases');
  const outputDirectory = path.resolve(__dirname, 'js');
  const tests = fs.readdirSync(casesDirectory).filter((test) => {
    const testDirectory = path.join(casesDirectory, test);
    const filterPath = path.join(testDirectory, 'test.filter.js');

    // eslint-disable-next-line global-require, import/no-dynamic-require
    if (fs.existsSync(filterPath) && !require(filterPath)()) {
      describe.skip(test, () => {
        it('filtered', () => {});
      });

      return false;
    }

    return true;
  });

  clearDirectory(outputDirectory);

  for (const directory of tests) {
    if (!/^(\.|_)/.test(directory)) {
      // eslint-disable-next-line no-loop-func
      it(`${directory} should compile to the expected result`, (done) => {
        if (directory === 'serializingBigStrings') {
          clearDirectory(path.resolve(__dirname, '../node_modules/.cache'));
        }

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

        webpack(webpackConfig, (error, stats) => {
          if (error) {
            done(error);

            return;
          }

          if (stats.hasErrors()) {
            const errorsPath = path.join(directoryForCase, './errors.test.js');

            if (fs.existsSync(errorsPath)) {
              const { errors } = stats.compilation;
              // eslint-disable-next-line global-require, import/no-dynamic-require
              const errorFilters = require(errorsPath);
              const filteredErrors = errors.filter(
                // eslint-disable-next-line no-shadow
                (error) =>
                  !errorFilters.some((errorFilter) => errorFilter.test(error))
              );

              if (filteredErrors.length > 0) {
                done(new Error(`Errors:\n${filteredErrors.join(',\n')}`));

                return;
              }

              done();

              return;
            }

            done(new Error(stats.toString()));

            return;
          }

          if (stats.hasErrors() && stats.hasWarnings()) {
            done(
              new Error(
                stats.toString({
                  context: path.resolve(__dirname, '..'),
                  errorDetails: true,
                  warnings: true,
                })
              )
            );

            return;
          }

          const expectedDirectory = path.resolve(directoryForCase, 'expected');
          const expectedDirectoryByVersion = path.join(
            expectedDirectory,
            `webpack-${webpack.version[0]}`
          );

          if (/^hmr/.test(directory)) {
            let res = fs
              .readFileSync(path.resolve(outputDirectoryForCase, 'main.js'))
              .toString();

            const date = Date.now().toString().slice(0, 6);
            const dateRegexp = new RegExp(`${date}\\d+`, 'gi');

            res = res.replace(dateRegexp, '');

            if (webpack.version[0] === '4') {
              const matchAll = res.match(/var hotCurrentHash = "([\d\w].*)"/i);
              const replacer = new Array(matchAll[1].length);

              res = res.replace(
                /var hotCurrentHash = "([\d\w].*)"/i,
                `var hotCurrentHash = "${replacer.fill('x').join('')}"`
              );
            } else {
              const matchAll = res.match(
                /__webpack_require__\.h = \(\) => \(("[\d\w].*")\)/i
              );

              const replacer = new Array(matchAll[1].length);

              res = res.replace(
                /__webpack_require__\.h = \(\) => \(("[\d\w].*")\)/i,
                `__webpack_require__.h = () => ("${replacer
                  .fill('x')
                  .join('')}")`
              );
            }

            fs.writeFileSync(
              path.resolve(outputDirectoryForCase, 'main.js'),
              res
            );
          }

          if (fs.existsSync(expectedDirectoryByVersion)) {
            compareDirectory(
              outputDirectoryForCase,
              expectedDirectoryByVersion
            );
          } else if (fs.existsSync(expectedDirectory)) {
            compareDirectory(outputDirectoryForCase, expectedDirectory);
          }

          const warningsFile = path.resolve(directoryForCase, 'warnings.js');

          if (fs.existsSync(warningsFile)) {
            const actualWarnings = stats.toString({
              all: false,
              warnings: true,
            });
            // eslint-disable-next-line global-require, import/no-dynamic-require
            const expectedWarnings = require(warningsFile);

            expect(
              actualWarnings
                .trim()
                .replace(/\*\scss\s(.*)?!/g, '* css /path/to/loader.js!')
            ).toBe(
              expectedWarnings
                .trim()
                .replace(/\*\scss\s(.*)?!/g, '* css /path/to/loader.js!')
            );
          }

          done();
        });
      }, 10000);
    }
  }
});
