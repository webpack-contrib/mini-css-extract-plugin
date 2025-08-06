/**
 * @jest-environment node
 */

import fs from "fs";
import path from "path";

import webpack from "webpack";

import Self from "../src/index";

import yn from "./helpers/yn";

function clearDirectory(dirPath) {
  let files;

  try {
    files = fs.readdirSync(dirPath);
  } catch {
    return;
  }
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const filePath = `${dirPath}/${files[i]}`;

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      } else {
        clearDirectory(filePath);
      }
    }
  }

  try {
    fs.rmdirSync(dirPath);
  } catch {
    // Nothing
  }
}

function compareDirectory(actual, expected) {
  const files = fs.readdirSync(expected);

  for (const file of files) {
    const absoluteFilePath = path.resolve(expected, file);

    const stats = fs.lstatSync(absoluteFilePath);

    if (stats.isDirectory()) {
      compareDirectory(
        path.resolve(actual, file),
        path.resolve(expected, file),
      );
    } else if (stats.isFile()) {
      const content = fs.readFileSync(path.resolve(expected, file), "utf8");
      let actualContent;

      if (content.startsWith("MISSING")) {
        expect(fs.existsSync(path.resolve(actual, file))).toBe(false);
      } else {
        try {
          actualContent = fs.readFileSync(path.resolve(actual, file), "utf8");
        } catch (error) {
          console.log(error);

          const dir = fs.readdirSync(actual);

          console.log({ [actual]: dir });
        }

        expect(actualContent).toEqual(content);
      }
    }
  }
}

describe("TestCases", () => {
  const casesDirectory = path.resolve(__dirname, "cases");
  const outputDirectory = path.resolve(__dirname, "js");
  const tests = fs.readdirSync(casesDirectory).filter((test) => {
    const testDirectory = path.join(casesDirectory, test);
    const filterPath = path.join(testDirectory, "test.filter.js");

    if (fs.existsSync(filterPath) && !require(filterPath)()) {
      // eslint-disable-next-line jest/no-disabled-tests
      describe.skip(test, () => {
        // eslint-disable-next-line jest/expect-expect
        it("filtered", () => {});
      });

      return false;
    }

    return true;
  });

  clearDirectory(outputDirectory);

  for (const directory of tests) {
    if (!/^(\.|_)/.test(directory)) {
      it(`${directory} should compile to the expected result`, (done) => {
        if (directory === "serializingBigStrings") {
          clearDirectory(path.resolve(__dirname, "../node_modules/.cache"));
        }

        const directoryForCase = path.resolve(casesDirectory, directory);
        const outputDirectoryForCase = path.resolve(outputDirectory, directory);

        const webpackConfig = require(
          path.resolve(directoryForCase, "webpack.config.js"),
        );

        const { context } = webpackConfig;

        for (const config of [webpackConfig].flat()) {
          Object.assign(
            config,
            {
              mode: config.mode || "none",
              context: directoryForCase,
            },
            config,
            {
              output: {
                path: outputDirectoryForCase,
                ...config.output,
              },
              plugins:
                config.plugins &&
                config.plugins.map((p) => {
                  if (p.constructor === Self) {
                    const { options } = p;

                    const useImportModule = yn(process.env.OLD_API);

                    if (useImportModule === true) {
                      options.experimentalUseImportModule = false;
                    }
                  }

                  return p;
                }),
            },
            context ? { context } : {},
          );
        }

        webpack(webpackConfig, (error, stats) => {
          if (error) {
            done(error);

            return;
          }

          if (stats.hasErrors()) {
            const errorsPath = path.join(directoryForCase, "./errors.test.js");

            if (fs.existsSync(errorsPath)) {
              const { errors } = stats.compilation;

              const errorFilters = require(errorsPath);

              const filteredErrors = errors.filter(
                (error) =>
                  !errorFilters.some((errorFilter) => errorFilter.test(error)),
              );

              if (filteredErrors.length > 0) {
                done(new Error(`Errors:\n${filteredErrors.join(",\n")}`));

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
                  context: path.resolve(__dirname, ".."),
                  errorDetails: true,
                  warnings: true,
                }),
              ),
            );

            return;
          }

          const expectedDirectory = path.resolve(directoryForCase, "expected");
          const expectedDirectoryByVersion = path.join(
            expectedDirectory,
            `webpack-${webpack.version[0]}${
              yn(process.env.OLD_API) ? "" : "-importModule"
            }`,
          );

          if (directory.startsWith("hmr")) {
            let res = fs
              .readFileSync(path.resolve(outputDirectoryForCase, "main.js"))
              .toString();

            const date = Date.now().toString().slice(0, 6);
            const dateRegexp = new RegExp(`${date}\\d+`, "gi");

            res = res.replace(dateRegexp, "");

            const matchAll = res.match(
              /__webpack_require__\.h = \(\) => \(("[\d\w].*")\)/i,
            );

            const replacer = Array.from({ length: matchAll[1].length });

            res = res.replace(
              /__webpack_require__\.h = \(\) => \(("[\d\w].*")\)/i,
              `__webpack_require__.h = () => ("${replacer.fill("x").join("")}")`,
            );

            fs.writeFileSync(
              path.resolve(outputDirectoryForCase, "main.js"),
              res,
            );
          }

          if (fs.existsSync(expectedDirectoryByVersion)) {
            compareDirectory(
              outputDirectoryForCase,
              expectedDirectoryByVersion,
            );
          } else if (fs.existsSync(expectedDirectory)) {
            compareDirectory(outputDirectoryForCase, expectedDirectory);
          }

          const warningsFile = path.resolve(directoryForCase, "warnings.js");

          if (fs.existsSync(warningsFile)) {
            const actualWarnings = stats.toString({
              all: false,
              warnings: true,
            });

            const expectedWarnings = require(warningsFile);

            expect(
              actualWarnings
                .trim()
                .replace(/\*\scss\s(.*)?!/g, "* css /path/to/loader.js!"),
            ).toBe(
              expectedWarnings
                .trim()
                .replace(/\*\scss\s(.*)?!/g, "* css /path/to/loader.js!"),
            );
          }

          done();
        });
      }, 10000);
    }
  }
});
