/* eslint-env browser */
import path from 'path';

import MiniCssExtractPlugin from '../src/cjs';

import {
  compile,
  getCompiler,
  getErrors,
  getWarnings,
  runInJsDom,
} from './helpers/index';

describe('insert option', () => {
  it(`should work without insert option`, async () => {
    const compiler = getCompiler(
      'insert.js',
      {},
      {
        mode: 'none',
        output: {
          publicPath: '',
          path: path.resolve(__dirname, '../outputs'),
          filename: '[name].bundle.js',
        },
        plugins: [
          new MiniCssExtractPlugin({
            filename: '[name].css',
          }),
        ],
      }
    );
    const stats = await compile(compiler);

    runInJsDom('main.bundle.js', compiler, stats, (dom) => {
      expect(dom.serialize()).toMatchSnapshot('DOM');
    });

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it(`should work when insert option is string`, async () => {
    const compiler = getCompiler(
      'insert.js',
      {},
      {
        mode: 'none',
        output: {
          publicPath: '',
          path: path.resolve(__dirname, '../outputs'),
          filename: '[name].bundle.js',
        },
        plugins: [
          new MiniCssExtractPlugin({
            filename: '[name].css',
            insert: '#existing-style',
          }),
        ],
      }
    );
    const stats = await compile(compiler);

    runInJsDom('main.bundle.js', compiler, stats, (dom) => {
      expect(dom.serialize()).toMatchSnapshot('DOM');
    });

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it(`should work when insert option is function`, async () => {
    const compiler = getCompiler(
      'insert.js',
      {},
      {
        mode: 'none',
        output: {
          publicPath: '',
          path: path.resolve(__dirname, '../outputs'),
          filename: '[name].bundle.js',
        },
        plugins: [
          new MiniCssExtractPlugin({
            filename: '[name].css',
            insert: function insert(linkTag) {
              const reference = document.querySelector('#existing-style');
              if (reference) {
                reference.parentNode.insertBefore(linkTag, reference);
              }
            },
          }),
        ],
      }
    );
    const stats = await compile(compiler);

    runInJsDom('main.bundle.js', compiler, stats, (dom) => {
      expect(dom.serialize()).toMatchSnapshot('DOM');
    });

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
