import fs from 'fs';
import path from 'path';
import webpack from 'webpack';

describe('TestCases', () => {
  const casesDirectory = path.resolve(__dirname, 'cases');
  const outputDirectory = path.resolve(__dirname, '../js');
  for (const directory of fs.readdirSync(casesDirectory)) {
    if (!/^(\.|_)/.test(directory)) {
      // eslint-disable-next-line no-loop-func
      it(`${directory} should compile to the expected result`, (done) => {
        const directoryForCase = path.resolve(casesDirectory, directory);
        const outputDirectoryForCase = path.resolve(outputDirectory, directory);
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const webpackConfig = require(path.resolve(directoryForCase, 'webpack.config.js'));
        webpack(Object.assign({
          mode: 'none',
          context: directoryForCase,
          output: {
            path: outputDirectoryForCase,
          },
        }, webpackConfig), (err, stats) => {
          if (err) {
            done(err);
            return;
          }
          done();
          // eslint-disable-next-line no-console
          console.log(stats.toString());
          if (stats.hasErrors()) {
            done(new Error(stats.toString()));
            return;
          }
          const expectedDirectory = path.resolve(directoryForCase, 'expected');
          for (const file of fs.readdirSync(expectedDirectory)) {
            const content = fs.readFileSync(path.resolve(expectedDirectory, file), 'utf-8');
            const actualContent = fs.readFileSync(path.resolve(outputDirectoryForCase, file), 'utf-8');
            expect(actualContent).toBeEqual(content);
          }
          done();
        });
      }, 10000);
    }
  }
});
