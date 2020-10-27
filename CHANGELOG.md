# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
