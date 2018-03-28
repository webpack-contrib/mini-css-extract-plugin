[![npm][npm]][npm-url]
[![deps][deps]][deps-url]
[![test][test]][test-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]

<div align="center">
  <!-- replace with accurate logo e.g from https://worldvectorlogo.com/ -->
  <img width="200" height="200" src="https://cdn.worldvectorlogo.com/logos/javascript.svg">
  <a href="https://webpack.js.org/">
    <img width="200" height="200" vspace="" hspace="25" src="https://cdn.rawgit.com/webpack/media/e7485eb2/logo/icon-square-big.svg">
  </a>
  <h1>mini-css-extract-plugin</h1>
  <p>desc</p>
</div>

This plugin extract CSS into separate files. It creates a CSS file per JS file which contains CSS. It supports On-Demand-Loading of CSS and SourceMaps.

It builds on top of a new webpack v4 feature (module types) and requires webpack 4 to work.

Compared to the extract-text-webpack-plugin:

* Async loading
* No duplicate compilation (performance)
* Easier to use
* Specific to CSS

TODO:

* HMR support

<h2 align="center">Install</h2>

```bash
npm install --save-dev mini-css-extract-plugin
```

<h2 align="center">Usage</h2>

### Configuration

**webpack.config.js**

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
    ]
  }
}
```

### Minimizing For Production

While webpack 5 is likely to come with a CSS minimizer built-in, with webpack 4 you need to bring your own. To minify the output, use a plugin like [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin). Setting `optimization.minimizer` overrides the defaults provided by webpack, so make sure to also specify a JS minimizer:

**webpack.config.js**

```js
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
    ]
  }
}
```

### Features

#### Using preloaded or inlined CSS

The runtime code detects already added CSS via `<link>` or `<style>` tag.
This can be useful when injecting CSS on server-side for Server-Side-Rendering.
The `href` of the `<link>` tag has to match the URL that will be used for loading the CSS chunk.
The `data-href` attribute can be used for `<link>` and `<style>` too.
When inlining CSS `data-href` must be used.

#### Extracting all CSS in a single file

Similar to what [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin) does, the CSS
can be extracted in one CSS file using `optimization.splitChunks.cacheGroups`.

**webpack.config.js**

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
    ]
  }
}
```

<h2 align="center">Maintainers</h2>

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/sokra">
          <img width="150" height="150" src="https://github.com/sokra.png?size=150">
          </br>
          Tobias Koppers
        </a>
      </td>
    </tr>
  <tbody>
</table>

#### Long Term Caching

For long term caching use `filename: "[contenthash].css"`. Optionally add `[name]`.


[npm]: https://img.shields.io/npm/v/mini-css-extract-plugin.svg
[npm-url]: https://npmjs.com/package/mini-css-extract-plugin

[deps]: https://david-dm.org/webpack-contrib/mini-css-extract-plugin.svg
[deps-url]: https://david-dm.org/webpack-contrib/mini-css-extract-plugin

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

[test]: http://img.shields.io/travis/webpack-contrib/mini-css-extract-plugin.svg
[test-url]: https://travis-ci.org/webpack-contrib/mini-css-extract-plugin

[cover]: https://codecov.io/gh/webpack-contrib/mini-css-extract-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/mini-css-extract-plugin
