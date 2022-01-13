# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.4.7](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v2.4.6...v2.4.7) (2022-01-13)


### Bug Fixes

* multiple serializer registrations ([#894](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/894)) ([c784204](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/c784204772538ab8984e1c25e4501a7602b41ad1))

### [2.4.6](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v2.4.5...v2.4.6) (2022-01-06)


### Bug Fixes

* crash when `publicPath` is function ([#881](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/881)) ([41bd828](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/41bd828ba11baf2c1349b3a8103072e2d82fd4c2))
* do not allow absolute path in the `chunkFilename` option ([#879](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/879)) ([36e04ab](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/36e04ab8b5e55d429ce361841e77f6ddba934ee1))
* do not allow absolute path in the `filename` option ([#878](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/878)) ([76361df](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/76361df4220f62c18b3660af76ab8b28c56d0471))

### [2.4.5](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v2.4.4...v2.4.5) (2021-11-17)

### Chore

* update `schema-utils` package to `4.0.0` version

### [2.4.4](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v2.4.3...v2.4.4) (2021-11-04)


### Bug Fixes

* crash with `[contenthash]` ([#869](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/869)) ([57ad127](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/57ad1274328512aebb20fa3b2c27fb9321f835a7))
* runtime path in modules without context ([#866](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/866)) ([e2e30b2](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/e2e30b280d51f313e3ac566af3b839e580b22ef5))

### [2.4.3](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v2.4.2...v2.4.3) (2021-10-21)


### Bug Fixes

* small perf improvement ([#860](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/860)) ([8c4846b](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/8c4846b3a55770cb7286b1f092e619204503ed7f))

### [2.4.2](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v2.4.1...v2.4.2) (2021-10-07)


### Bug Fixes

* endless apply of loaders, leading to memory allocation failure ([#849](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/849)) ([94ad699](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/94ad699baa1805a0646e7db1d69eb5997df6c8db))

### [2.4.1](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v2.4.0...v2.4.1) (2021-10-05)


### Bug Fixes

* crash with multiple webpack versions ([#845](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/845)) ([b4431cb](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/b4431cb60a6eadcf8c2b614f494faf899c73aaa0))

## [2.4.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v2.3.0...v2.4.0) (2021-10-05)

### Performance

* migrate on new API, this improves performance and memory usage a lot, you need to have at least webpack `5.52.0` (recommended latest stable), for older versions the old API will be used (except explicit enabling of the `experimentalUseImportModule` option)


### Features

* added support for `supports()` and `layer()` in `@import` at-rule ([#843](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/843)) ([e751080](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/e751080ad6a81f196d5c26fb79b3c69b9429a634))


### Bug Fixes

* crash with the `exportLocalsConvention` option ([#844](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/844)) ([0f8d501](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/0f8d5015c95724b537ddc627758f67020d01ae0b))

## [2.3.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v2.2.2...v2.3.0) (2021-09-11)


### Features

* added the `runtime` option ([#831](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/831)) ([5cc73e6](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/5cc73e6b590632263fc6ea0a830df1322520c2f4))


### Bug Fixes

* better description for async chunk options ([34b65ac](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/34b65ac4daea5a977a75846b159becbc2ebb0632))

### [2.2.2](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v2.2.1...v2.2.2) (2021-09-01)


### Bug Fixes

* `experimentalUseImportModule` works with `new URL(...)` syntax ([cf81c4b](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/cf81c4b9962e74d666f6bb7d6473a9b6c06936cd))

### [2.2.1](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v2.2.0...v2.2.1) (2021-08-31)


### Bug Fixes

* order of `@import` with the `output.pathinfo` option ([#815](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/815)) ([831f771](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/831f771b3c5e59978dbc53f1ccc90e23a9e30e9b))
* source map generation with the `output.pathinfo` option ([#817](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/817)) ([f813b4c](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/f813b4c7b72383b8777da74b90830be20db6a483))

## [2.2.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v2.0.0...v2.2.0) (2021-08-04)


### Features

* add `link` and `description` for options ([#786](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/786)) ([3c5a5b7](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/3c5a5b7aba8ed855368a7e95d89420b97dcd1531))


### Bug Fixes

* hmr in browser extension ([3d09da1](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/3d09da1abb9250b39c6a15efd33950aa19efb0b3))

## [2.1.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v2.0.0...v2.1.0) (2021-07-05)


### Features

* support the `pathinfo` option ([#783](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/783)) ([a37713f](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/a37713f53bcecb9efc3f8a4d389c6274dae0bc85))

## [2.0.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.6.2...v2.0.0) (2021-06-30)

### NOTES

In the current release we have fixed many problems with `publicPath`, previously to generate relative URLs inside CSS files developers use different hacks: `publicPath: ''`, `publicPath: '../'`, using relative `../../` in the `outputPath` option for `file-loader` and etc. Now you don't need it anymore. Webpack v5 uses `publicPath: "auto"` by default, which means to always generate relative URLs, and now `mini-css-extract-plugin` does the same. 

**We strongly recommend use `auto` value by default (except when using CDN).**

**We also want to show you that the [`file-loader`](https://github.com/webpack-contrib/file-loader) and [`url-loader`](https://github.com/webpack-contrib/url-loader) are outdated, please migrate on [Asset Modules](https://webpack.js.org/guides/asset-modules/).**

### ⚠ BREAKING CHANGES

* minimum supported `Node.js` version is `12.13.0`
* minimum supported `webpack` version is `5.0.0`
* the `modules.namedExport` option was removed, you don't need it anymore, because we respect the `modules.namedExport` option from `css-loader`, just remove it
* the `publicPath` option no longer automatically adds `/` (trailing slash), you need to specify, you need to specify it yourself if it is absent, i.e. if you have `publicPath: "/my/public/path"` replace it with `publicPath: "/my/public/path/"`

### Bug Fixes

* generating correct relative `url()` for assets inside CSS files when you use `publicPath: "auto"` (default value)


### [1.6.2](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.6.1...v1.6.2) (2021-06-28)

### Bug Fixes

* performance improvement

### [1.6.1](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.6.0...v1.6.1) (2021-06-25)


### Bug Fixes

* memory leaks ([c68aca7](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/c68aca7c58b1bfb3d3f9f8db70fd814e50f82aa1))

## [1.6.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.5.1...v1.6.0) (2021-04-30)


### Features

* added new url support ([#753](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/753)) ([c76a1a1](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/c76a1a16b926e3dc8f6763d940ab6e4eb170c77f))

### [1.5.1](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.5.0...v1.5.1) (2021-04-28)


### Bug Fixes

* compatibility with named export and es5 ([#751](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/751)) ([3be81bb](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/3be81bb4e795fc9295c2c7e7a8bb71de9cead2d0))

## [1.5.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.4.1...v1.5.0) (2021-04-17)


### Features

* add experimental support for `importModule`, improve perfomance ([#737](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/737)) ([8471ac2](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/8471ac24dde3d7e874995f8ab4814cc94b4179e1))

### [1.4.1](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.4.0...v1.4.1) (2021-04-07)


### Bug Fixes

* ES5 compatibility ([43e081f](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/43e081f3a2767f3c00a29349a71ad17eca9cc168))

## [1.4.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.3.9...v1.4.0) (2021-03-26)


### Features

* added the `emit` option for SSR ([#732](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/732)) ([03b4293](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/03b4293023e85e89abf46a2e42d61ec8684cb318))

### [1.3.9](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.3.8...v1.3.9) (2021-02-25)


### Bug Fixes

* allow consumers to access `CssModule` and `CssDependency` ([#703](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/703)) ([6484345](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/64843452a7c07963637a749bce9628d808694eac))
* allow to use `auto` value with the `publicPath` option ([#709](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/709)) ([1be21d2](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/1be21d29053c32cfec26eb58aa5deabd65069c71))

### [1.3.8](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.3.7...v1.3.8) (2021-02-18)


### Bug Fixes

* deterministic `[contenthash]` ([#702](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/702)) ([2ff8e59](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/2ff8e592e13d54dc87fad4fcf5065136d4610dca))

### [1.3.7](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.3.6...v1.3.7) (2021-02-15)


### Bug Fixes

* compatibility with webpack v5 ([9b6b8b3](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/9b6b8b3a8393a62b7b7a3b38c0c52b694ed51e19))

### [1.3.6](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.3.5...v1.3.6) (2021-02-08)


### Bug Fixes

* do not crash on using `[fullhash]` ([#695](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/695)) ([dbb708c](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/dbb708cf181d8f3d69af11cc15f959f187e38ffa))

### [1.3.5](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.3.4...v1.3.5) (2021-01-28)


### Bug Fixes

* bloated runtime ([#687](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/687)) ([70ce174](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/70ce174941016174bb82ff46c808593a1e1b7e1e))
* hmr runtime on preloaded stylesheet link ([#686](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/686)) ([05e2951](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/05e29514952bf3ff3f30ec33c4bda66999d8486b))
* yarn pnp compatibility ([#688](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/688)) ([05b188a](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/05b188a055ee6663f8d307e99b22c51200fee320))

### [1.3.4](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.3.3...v1.3.4) (2021-01-13)


### Bug Fixes

* `identifier` for `CssModule` ([#677](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/677)) ([117a97a](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/117a97acaa5b37c5183b5b48264d7e524e8f5bc3))

### [1.3.3](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.3.2...v1.3.3) (2020-12-10)


### Bug Fixes

* serializing big strings in sourceMap ([#665](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/665)) ([f7a5e53](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/f7a5e5381ce1d2b822d49b688027d06efec2312d))

### [1.3.2](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.3.1...v1.3.2) (2020-12-04)


### Bug Fixes

* missing auxiliary assets ([#662](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/662)) ([f28c1e1](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/f28c1e115fb9aacbd87e3b1540adb7418a4cc375))

### [1.3.1](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.3.0...v1.3.1) (2020-11-12)


### Bug Fixes

* compatibility with asset modules ([#656](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/656)) ([bea1f4d](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/bea1f4d0c25abc6268b8076305e9879344ff1701))

## [1.3.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.2.1...v1.3.0) (2020-11-06)


### ⚠ POTENTIAL BREAKING CHANGE

Options are now validated according to stricter rules - no unknown additional properties. For example, if you have not removed the `hmr` option for the loader when migrating to `mini-css-extract-plugin@1`, you will get an error. Just remove them from your configuration(s). We did this because many developers started making these mistakes. 

### Features

* added the `type` property for loading errors ([#651](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/651)) ([be9ddcb](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/be9ddcba7f4b216aa52dcd64a0e450a312b7156f))


### Bug Fixes

* schema ([#652](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/652)) ([4e4733d](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/4e4733dc10fd8a8ecda5b47421b390a479b826aa))
* serializing big strings ([#647](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/647)) ([022d945](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/022d9459a6f158166e700c11a02b9063154c96bc))
* source map url for devtool (only webpack@5) ([#650](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/650)) ([5889d43](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/5889d43bafe8613a29e3a8156f0b5052b6ad88b9))

### [1.2.1](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.2.0...v1.2.1) (2020-10-27)


### Bug Fixes

* onerror/onload memory leak ([#640](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/640)) ([2b6fcf2](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/2b6fcf260b2fb13afe2abd052cff5dea184ef398))

## [1.2.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.1.2...v1.2.0) (2020-10-23)


### Features

* added the `linkType` option ([#634](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/634)) ([a89c0f9](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/a89c0f982716d1093dbe6b12de47e4e8df1543f5))


### Bug Fixes

* compatibility with webpack@4 and webpack@5 for monorepos ([#638](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/638)) ([60c3eef](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/60c3eef936245183451d63f1e080ce990553078d))

### [1.1.2](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.1.0...v1.1.2) (2020-10-22)


### Bug Fixes

* compatibility with webpack@4 and webpack@5 for monorepos ([#636](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/636)) ([3413439](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/341343924d96f5d0076f27b98c96f9439bff6347))
* error when reloading async chunk ([#633](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/633)) ([89e7a0a](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/89e7a0acf08f36711c916a4827ea6afff7028afb))

### [1.1.1](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.1.0...v1.1.1) (2020-10-20)


### Bug Fixes

* fix `onerror` message for async chunks ([#629](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/629)) ([883079e](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/883079e02b9d400fab4e8a955604036a3be50c48))

## [1.1.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v1.0.0...v1.1.0) (2020-10-19)


### Features

* added the `attributes` option ([e8a2d5a](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/e8a2d5a09ded967e0f4be145f1f52c1e5f7f6df1))
* added the `insert` option ([a5f17c4](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/a5f17c48cbf0c198ebc955032d11593434ef2373))


### Bug Fixes

* ignore modules without identifier ([#627](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/627)) ([71a9ce9](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/71a9ce91b377fff892068b87445372fe1c2db142))
* remove `normalize-url` from deps ([#623](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/623)) ([9ae47e5](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/9ae47e51f198f2e0258d0e87d6e708e57c05bf86))

### [1.0.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v0.12.0...v1.0.0) (2020-10-09)

### BREAKING CHANGE

* minimum supported `Node.js` version is `10.13.0`
* the `esModule` option is `true` by default, you need to change `const locals = require('./styles.css')`/`require('./styles.css')` on `import locals from './styles.css'`/`import './styles.css''`
* the `moduleFilename` option was removed in favor the `filename` option
* the `hmr` option was removed, HMR will work automatically when `HotModuleReplacement` plugin used or `webpack-dev-server` with enabled the `hot` option
* the `reloadAll` was removed

### Features

- the `chunkFilename` option can be a function for webpack@5

### ⚠ NOTICE

To avoid problems between `mini-css-extract-plugin` and `style-loader` because of changing the `esModule` option to `true` by default we strongly recommend upgrading `style-loader` to `2.0.0` version.

### [0.12.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v0.11.3...v0.12.0) (2020-10-07)


### Features

* opt-in to transitive only side effects (webpack@5), no more empty JS chunks

### [0.11.3](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v0.11.2...v0.11.3) (2020-10-02)


### Bug Fixes

* better support for webpack 5 ([#595](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/595)) ([6e09a51](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/6e09a51954aee1c8db904747e0b9bc42d14e7b47))

### [0.11.2](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v0.11.1...v0.11.2) (2020-09-12)


### Bug Fixes

* cache for webpack@5 ([6a27b30](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/6a27b30fea43d2d179d7df5deb260887d6b45ccc))

### [0.11.1](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v0.11.0...v0.11.1) (2020-09-08)


### Bug Fixes

* added cache serializer for webpack@5 ([#581](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/581)) ([d09693e](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/d09693e7d50858c319a804736cf9609479140ad8))

### [0.11.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v0.10.0...v0.11.0) (2020-08-27)


### Features

* named export ([1ea4b7f](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/1ea4b7fe8305fcca7915d5c1dccd6041bab2c053))


### Bug Fixes

* compatibility with webpack@5

### [0.10.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v0.9.0...v0.10.0) (2020-08-10)


### Features

* schema validation ([#480](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/480)) ([b197757](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/b197757e26af717a302485293a2b95bc0eb6cf71))

### Bug Fixes

* add semicolon to avoid `Uncaught TypeError` on Webpack v5 ([#561](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/561)) ([3974210](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/3974210ec820f47cf717cd0829d4e4e3879a518a))
* enforce esm ([#546](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/546)) ([b146549](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/b1465491b1706e0f450cf69df4cf8176799907d1))
* partial compatibility with `webpack@5` ([#477](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/477)) ([903a56e](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/903a56ea3fa08e173cd548d23089d0cee25bafea))

### [0.9.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v0.8.2...v0.9.0) (2019-12-20)


### Features

* new `esModule` option ([#475](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/475)) ([596e47a](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/596e47a8aead53f9cc0e2b1e09a2c20e455e45c1))

### [0.8.2](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v0.8.1...v0.8.2) (2019-12-17)


### Bug Fixes

* context for dependencies ([#474](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/474)) ([0269860](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/0269860adb0eaad477901188eea66693fedf7769))

### [0.8.1](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v0.8.0...v0.8.1) (2019-12-17)


### Bug Fixes

* use filename mutated after instantiation ([#430](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/430)) ([0bacfac](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/0bacfac7ef4a06b4810fbc140875f7a038caa5bc))
* improve warning of conflict order ([#465](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/465)) ([357d073](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/357d073bf0259f2c44e613ad4dfcbcc8354e4be3))
* support ES module syntax ([#472](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/472)) ([2f72e1a](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/2f72e1aa267de23f121441714e88406f579e77b2))

## [0.8.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v0.7.0...v0.8.0) (2019-07-16)


### Features

* Add ignoreOrder option ([#422](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/422)) ([4ad3373](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/4ad3373))



## [0.7.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v0.6.0...v0.7.0) (2019-05-27)


### Bug Fixes

* do not attempt to reload unrequestable urls ([#378](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/378)) ([44d00ea](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/44d00ea))
* fix `publicPath` regression ([#384](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/384)) ([582ebfe](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/582ebfe))
* enable using plugin without defining options ([#393](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/393)) ([a7dee8c](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/a7dee8c))
* downgrading normalize-url ([#399](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/399)) ([0dafaf6](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/0dafaf6))
* hmr do not crash on link without href ([#400](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/400)) ([aa9b541](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/aa9b541))
* hmr reload with invalid link url ([#402](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/402)) ([30a19b0](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/30a19b0))


### Features

* add `moduleFilename` option ([#381](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/381)) ([13e9cbf](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/13e9cbf))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v0.5.0...v0.6.0) (2019-04-10)


### Features

* added error code to chunk load Error ([#347](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/347)) ([b653641](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/b653641))
* adding hot module reloading ([#334](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/334)) ([4ed9c5a](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/4ed9c5a))
* publicPath can be a function ([#373](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/373)) ([7b1425a](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/7b1425a))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v0.4.5...v0.5.0) (2018-12-07)


### Features

* add crossOriginLoading option support ([#313](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/313)) ([ffb0d87](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/ffb0d87))



<a name="0.4.5"></a>
## [0.4.5](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v0.4.4...v0.4.5) (2018-11-21)


### Bug Fixes

* **index:** allow requesting failed async css files ([#292](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/292)) ([2eb0af5](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/2eb0af5))



<a name="0.4.4"></a>
## [0.4.4](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v0.4.3...v0.4.4) (2018-10-10)


### Bug Fixes

* **index:** assign empty `module.id` to prevent `contenthash` from changing unnecessarily ([#284](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/284)) ([d7946d0](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/d7946d0))



<a name="0.4.3"></a>
## [0.4.3](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v0.4.2...v0.4.3) (2018-09-18)


### Bug Fixes

* **loader:** pass `emitFile` to the child compilation (`loaderContext.emitFile`) ([#177](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/177)) ([18c066e](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/18c066e))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v0.4.0...v0.4.2) (2018-08-21)


### Bug Fixes

* use correct order when multiple chunk groups are merged ([#246](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/246)) ([c3b363d](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/c3b363d))



<a name="0.4.1"></a>
## [0.4.1](https://github.com/webpack-contrib/mini-css-extract-plugin/compare/v0.4.0...v0.4.1) (2018-06-29)


### Bug Fixes

* CSS ordering with multiple entry points ([#130](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/130)) ([79373eb](https://github.com/webpack-contrib/mini-css-extract-plugin/commit/79373eb))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

x.x.x / <year>-<month>-<day>
==================

  * Bug fix -
  * Feature -
  * Chore -
  * Docs -
