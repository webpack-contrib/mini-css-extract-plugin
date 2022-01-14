/* eslint-disable class-methods-use-this */

import path from "path";

import { validate } from "schema-utils";

import schema from "./plugin-options.json";
import {
  trueFn,
  MODULE_TYPE,
  AUTO_PUBLIC_PATH,
  ABSOLUTE_PUBLIC_PATH,
  SINGLE_DOT_PATH_SEGMENT,
  compareModulesByIdentifier,
  getUndoPath,
} from "./utils";

/** @typedef {import("schema-utils/declarations/validate").Schema} Schema */
/** @typedef {import("webpack").Compiler} Compiler */
/** @typedef {import("webpack").Compilation} Compilation */
/** @typedef {import("webpack").ChunkGraph} ChunkGraph */
/** @typedef {import("webpack").Chunk} Chunk */
/** @typedef {import("webpack").Module} Module */
/** @typedef {import("webpack").sources.Source} Source */
/** @typedef {import("webpack").Configuration} Configuration */
/** @typedef {import("webpack").WebpackError} WebpackError */

/**
 * @typedef {Object} LoaderOptions
 * @property {string | ((resourcePath: string, rootContext: string) => string)} [publicPath]
 * @property {boolean} [emit]
 * @property {boolean} [esModule]
 * @property {string} [layer]
 */

/**
 * @typedef {Object} PluginOptions
 * @property {Required<Configuration>['output']['filename']} [filename]
 * @property {Required<Configuration>['output']['chunkFilename']} [chunkFilename]
 * @property {boolean} [ignoreOrder]
 * @property {string | ((linkTag: any) => void)} [insert]
 * @property {Record<string, string>} [attributes]
 * @property {string | false | 'text/css'} [linkType]
 * @property {boolean} [runtime]
 * @property {boolean} [experimentalUseImportModule]
 */

/**
 * @typedef {Object} NormalizedPluginOptions
 * @property {Required<Configuration>['output']['filename']} filename
 * @property {Required<Configuration>['output']['chunkFilename']} [chunkFilename]
 * @property {boolean} ignoreOrder
 * @property {string | ((linkTag: any) => void)} [insert]
 * @property {Record<string, string>} [attributes]
 * @property {string | false | 'text/css'} [linkType]
 * @property {boolean} runtime
 * @property {boolean} [experimentalUseImportModule]
 */

/**
 * @typedef {Object} RuntimeOptions
 * @property {string | ((linkTag: any) => void) | undefined} insert
 * @property {string | false | 'text/css'} linkType
 * @property {Record<string, string> | undefined} attributes
 */

/** @typedef {any} TODO */

export const pluginName = "mini-css-extract-plugin";
export const pluginSymbol = Symbol(pluginName);

const DEFAULT_FILENAME = "[name].css";
const TYPES = new Set([MODULE_TYPE]);
const CODE_GENERATION_RESULT = {
  sources: new Map(),
  runtimeRequirements: new Set(),
};

/** @type WeakMap<Compiler["webpack"], TODO> */
const cssModuleCache = new WeakMap();

/** @type WeakMap<Compiler["webpack"], TODO> */
const cssDependencyCache = new WeakMap();

const registered = new WeakSet();

class MiniCssExtractPlugin {
  /**
   * @private
   * @param {Compiler["webpack"]} webpack
   * @returns {CssModule}
   */
  static getCssModule(webpack) {
    /**
     * Prevent creation of multiple CssModule classes to allow other integrations to get the current CssModule.
     */
    if (cssModuleCache.has(webpack)) {
      return cssModuleCache.get(webpack);
    }

    // @ts-ignore
    class CssModule extends webpack.Module {
      /**
       * @param {{ context: TODO, identifier: string, identifierIndex: number, content: Buffer, layer?: string, supports?: string, media: string, sourceMap?: Buffer, assets: TODO, assetsInfo: TODO }} build
       */
      constructor({
        context,
        identifier,
        identifierIndex,
        content,
        layer,
        supports,
        media,
        sourceMap,
        assets,
        assetsInfo,
      }) {
        super(MODULE_TYPE, context);

        this.id = "";
        this._context = context;
        this._identifier = identifier;
        this._identifierIndex = identifierIndex;
        this.content = content;
        this.layer = layer;
        this.supports = supports;
        this.media = media;
        this.sourceMap = sourceMap;
        this.assets = assets;
        this.assetsInfo = assetsInfo;
        this._needBuild = true;
      }

      // no source() so webpack 4 doesn't do add stuff to the bundle

      size() {
        return this.content.length;
      }

      identifier() {
        return `css|${this._identifier}|${this._identifierIndex}`;
      }

      /**
       * @param {Compilation["requestShortener"]} requestShortener
       * @returns {string}
       */
      readableIdentifier(requestShortener) {
        return `css ${requestShortener.shorten(this._identifier)}${
          this._identifierIndex ? ` (${this._identifierIndex})` : ""
        }`;
      }

      // eslint-disable-next-line class-methods-use-this
      getSourceTypes() {
        return TYPES;
      }

      // eslint-disable-next-line class-methods-use-this
      codeGeneration() {
        return CODE_GENERATION_RESULT;
      }

      nameForCondition() {
        const resource = /** @type {string} */ (
          this._identifier.split("!").pop()
        );
        const idx = resource.indexOf("?");

        if (idx >= 0) {
          return resource.substring(0, idx);
        }

        return resource;
      }

      /**
       * @param {TODO} module
       */
      updateCacheModule(module) {
        if (
          this.content !== module.content ||
          this.layer !== module.layer ||
          this.supports !== module.supports ||
          this.media !== module.media ||
          this.sourceMap !== module.sourceMap ||
          this.assets !== module.assets ||
          this.assetsInfo !== module.assetsInfo
        ) {
          this._needBuild = true;

          this.content = module.content;
          this.layer = module.layer;
          this.supports = module.supports;
          this.media = module.media;
          this.sourceMap = module.sourceMap;
          this.assets = module.assets;
          this.assetsInfo = module.assetsInfo;
        }
      }

      // eslint-disable-next-line class-methods-use-this
      needRebuild() {
        return this._needBuild;
      }

      // eslint-disable-next-line class-methods-use-this
      /**
       * @param {TODO} context context info
       * @param {function(WebpackError=, boolean=): void} callback callback function, returns true, if the module needs a rebuild
       * @returns {void}
       */
      needBuild(context, callback) {
        // eslint-disable-next-line no-undefined
        callback(undefined, this._needBuild);
      }

      /**
       * @param {TODO} options
       * @param {Compilation} compilation
       * @param {TODO} resolver
       * @param {TODO} fileSystem
       * @param {TODO} callback
       */
      build(options, compilation, resolver, fileSystem, callback) {
        this.buildInfo = {
          assets: this.assets,
          assetsInfo: this.assetsInfo,
          cacheable: true,
          hash: this._computeHash(
            /** @type {string} */ (compilation.outputOptions.hashFunction)
          ),
        };
        this.buildMeta = {};
        this._needBuild = false;

        callback();
      }

      /**
       * @private
       * @param {string} hashFunction
       * @returns {string | Buffer}
       */
      _computeHash(hashFunction) {
        const hash = webpack.util.createHash(hashFunction);

        hash.update(this.content);

        if (this.layer) {
          hash.update(this.layer);
        }

        hash.update(this.supports || "");
        hash.update(this.media || "");
        hash.update(this.sourceMap || "");

        return hash.digest("hex");
      }

      /**
       * @param {TODO} hash
       * @param {TODO} context
       */
      updateHash(hash, context) {
        super.updateHash(hash, context);

        hash.update(this.buildInfo.hash);
      }

      /**
       * @param {{ write: (arg0?: any) => void }} context
       */
      serialize(context) {
        const { write } = context;

        write(this._context);
        write(this._identifier);
        write(this._identifierIndex);
        write(this.content);
        write(this.layer);
        write(this.supports);
        write(this.media);
        write(this.sourceMap);
        write(this.assets);
        write(this.assetsInfo);

        write(this._needBuild);

        super.serialize(context);
      }

      /**
       * @param {{ read: (arg0?: any) => void }} context
       */
      deserialize(context) {
        // @ts-ignore
        this._needBuild = context.read();

        super.deserialize(context);
      }
    }

    cssModuleCache.set(webpack, CssModule);

    webpack.util.serialization.register(
      CssModule,
      path.resolve(__dirname, "CssModule"),
      // @ts-ignore
      null,
      {
        serialize(instance, context) {
          instance.serialize(context);
        },
        deserialize(context) {
          const { read } = context;

          const contextModule = read();
          const identifier = read();
          const identifierIndex = read();
          const content = read();
          const layer = read();
          const supports = read();
          const media = read();
          const sourceMap = read();
          const assets = read();
          const assetsInfo = read();
          const dep = new CssModule({
            context: contextModule,
            identifier,
            identifierIndex,
            content,
            layer,
            supports,
            media,
            sourceMap,
            assets,
            assetsInfo,
          });

          dep.deserialize(context);

          return dep;
        },
      }
    );

    // @ts-ignore
    return CssModule;
  }

  /**
   * @private
   * @param {Compiler["webpack"]} webpack
   * @returns {CssDependency}
   */
  static getCssDependency(webpack) {
    /**
     * Prevent creation of multiple CssDependency classes to allow other integrations to get the current CssDependency.
     */
    if (cssDependencyCache.has(webpack)) {
      return cssDependencyCache.get(webpack);
    }

    class CssDependency extends webpack.Dependency {
      /**
       * @param {{ identifier: string, content: Buffer, layer?: string, supports?: string, media: string, sourceMap?: Buffer }} build
       * @param {TODO} context
       * @param {number} identifierIndex
       */
      constructor(
        { identifier, content, layer, supports, media, sourceMap },
        context,
        identifierIndex
      ) {
        super();

        this.identifier = identifier;
        this.identifierIndex = identifierIndex;
        this.content = content;
        this.layer = layer;
        this.supports = supports;
        this.media = media;
        this.sourceMap = sourceMap;
        this.context = context;
        /** @type {TODO} */
        // eslint-disable-next-line no-undefined
        this.assets = undefined;
        /** @type {TODO} */
        // eslint-disable-next-line no-undefined
        this.assetsInfo = undefined;
      }

      /**
       * @returns {string}
       */
      getResourceIdentifier() {
        return `css-module-${this.identifier}-${this.identifierIndex}`;
      }

      // @ts-ignore
      // eslint-disable-next-line class-methods-use-this
      getModuleEvaluationSideEffectsState() {
        return webpack.ModuleGraphConnection.TRANSITIVE_ONLY;
      }

      /**
       * @param {{ write: (arg0?: any) => void }} context
       */
      serialize(context) {
        const { write } = context;

        write(this.identifier);
        write(this.content);
        write(this.layer);
        write(this.supports);
        write(this.media);
        write(this.sourceMap);
        write(this.context);
        write(this.identifierIndex);
        write(this.assets);
        write(this.assetsInfo);

        super.serialize(context);
      }

      /**
       * @param {{ read: (arg0?: any) => void }} context
       */
      deserialize(context) {
        super.deserialize(context);
      }
    }

    cssDependencyCache.set(webpack, CssDependency);

    webpack.util.serialization.register(
      CssDependency,
      path.resolve(__dirname, "CssDependency"),
      // @ts-ignore
      null,
      {
        serialize(instance, context) {
          instance.serialize(context);
        },
        deserialize(context) {
          const { read } = context;
          const dep = new CssDependency(
            {
              identifier: read(),
              content: read(),
              layer: read(),
              supports: read(),
              media: read(),
              sourceMap: read(),
            },
            read(),
            read()
          );

          const assets = read();
          const assetsInfo = read();

          dep.assets = assets;
          dep.assetsInfo = assetsInfo;

          dep.deserialize(context);

          return dep;
        },
      }
    );

    // @ts-ignore
    return CssDependency;
  }

  /**
   * @param {PluginOptions} [options]
   */
  constructor(options = {}) {
    validate(/** @type {Schema} */ (schema), options, {
      baseDataPath: "options",
    });

    this._sortedModulesCache = new WeakMap();

    /**
     * @private
     * @type {NormalizedPluginOptions}
     */
    this.options = Object.assign(
      {
        filename: DEFAULT_FILENAME,
        ignoreOrder: false,
        // TODO remove in the next major release
        // eslint-disable-next-line no-undefined
        experimentalUseImportModule: undefined,
        runtime: true,
      },
      options
    );

    /**
     * @private
     * @type {RuntimeOptions}
     */
    this.runtimeOptions = {
      insert: options.insert,
      linkType:
        // Todo in next major release set default to "false"
        // @ts-ignore
        (typeof options.linkType === "boolean" && options.linkType === true) ||
        typeof options.linkType === "undefined"
          ? "text/css"
          : options.linkType,
      attributes: options.attributes,
    };

    if (!this.options.chunkFilename) {
      const { filename } = this.options;

      if (typeof filename !== "function") {
        const hasName = /** @type {string} */ (filename).includes("[name]");
        const hasId = /** @type {string} */ (filename).includes("[id]");
        const hasChunkHash =
          /** @type {string} */
          (filename).includes("[chunkhash]");
        const hasContentHash =
          /** @type {string} */
          (filename).includes("[contenthash]");

        // Anything changing depending on chunk is fine
        if (hasChunkHash || hasContentHash || hasName || hasId) {
          this.options.chunkFilename = filename;
        } else {
          // Otherwise prefix "[id]." in front of the basename to make it changing
          this.options.chunkFilename =
            /** @type {string} */
            (filename).replace(/(^|\/)([^/]*(?:\?|$))/, "$1[id].$2");
        }
      } else {
        this.options.chunkFilename = "[id].css";
      }
    }
  }

  /**
   * @param {Compiler} compiler
   */
  apply(compiler) {
    const { webpack } = compiler;

    if (this.options.experimentalUseImportModule) {
      // @ts-ignore
      if (typeof compiler.options.experiments.executeModule === "undefined") {
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        compiler.options.experiments.executeModule = true;
      }
    }

    // TODO bug in webpack, remove it after it will be fixed
    // webpack tries to `require` loader firstly when serializer doesn't found
    if (!registered.has(webpack)) {
      registered.add(webpack);

      webpack.util.serialization.registerLoader(
        /^mini-css-extract-plugin\//,
        trueFn
      );
    }

    const { splitChunks } = compiler.options.optimization;

    if (splitChunks) {
      if (
        /** @type {string[]} */ (splitChunks.defaultSizeTypes).includes("...")
      ) {
        /** @type {string[]} */
        (splitChunks.defaultSizeTypes).push(MODULE_TYPE);
      }
    }

    const CssModule = MiniCssExtractPlugin.getCssModule(webpack);
    const CssDependency = MiniCssExtractPlugin.getCssDependency(webpack);

    const { NormalModule } = compiler.webpack;

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      const { loader: normalModuleHook } =
        NormalModule.getCompilationHooks(compilation);

      normalModuleHook.tap(pluginName, (loaderContext) => {
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        loaderContext[pluginSymbol] = {
          experimentalUseImportModule: this.options.experimentalUseImportModule,
        };
      });
    });

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      class CssModuleFactory {
        /**
         * @param {TODO} dependency
         * @param {TODO} callback
         */
        // eslint-disable-next-line class-methods-use-this
        create({ dependencies: [dependency] }, callback) {
          // @ts-ignore
          callback(null, new CssModule(dependency));
        }
      }

      compilation.dependencyFactories.set(
        // @ts-ignore
        CssDependency,
        new CssModuleFactory()
      );

      class CssDependencyTemplate {
        // eslint-disable-next-line class-methods-use-this
        apply() {}
      }

      compilation.dependencyTemplates.set(
        // @ts-ignore
        CssDependency,
        new CssDependencyTemplate()
      );

      // @ts-ignore
      compilation.hooks.renderManifest.tap(pluginName, (result, { chunk }) => {
        const { chunkGraph } = compilation;
        const { HotUpdateChunk } = webpack;

        // We don't need hot update chunks for css
        // We will use the real asset instead to update
        if (chunk instanceof HotUpdateChunk) {
          return;
        }

        const renderedModules = Array.from(
          this.getChunkModules(chunk, chunkGraph)
        ).filter((module) => module.type === MODULE_TYPE);

        const filenameTemplate = chunk.canBeInitial()
          ? this.options.filename
          : this.options.chunkFilename;

        if (renderedModules.length > 0) {
          result.push({
            render: () =>
              this.renderContentAsset(
                compiler,
                compilation,
                chunk,
                renderedModules,
                compilation.runtimeTemplate.requestShortener,
                // @ts-ignore
                filenameTemplate,
                {
                  contentHashType: MODULE_TYPE,
                  chunk,
                }
              ),
            // @ts-ignore
            filenameTemplate,
            pathOptions: {
              chunk,
              contentHashType: MODULE_TYPE,
            },
            identifier: `${pluginName}.${chunk.id}`,
            hash: chunk.contentHash[MODULE_TYPE],
          });
        }
      });

      compilation.hooks.contentHash.tap(pluginName, (chunk) => {
        const { outputOptions, chunkGraph } = compilation;
        const modules = this.sortModules(
          compilation,
          chunk,
          /** @type {Iterable<Module>} */
          (chunkGraph.getChunkModulesIterableBySourceType(chunk, MODULE_TYPE)),
          compilation.runtimeTemplate.requestShortener
        );

        if (modules) {
          const { hashFunction, hashDigest, hashDigestLength } = outputOptions;
          const { createHash } = compiler.webpack.util;
          const hash = createHash(/** @type {string} */ (hashFunction));

          for (const m of modules) {
            hash.update(chunkGraph.getModuleHash(m, chunk.runtime));
          }

          // eslint-disable-next-line no-param-reassign
          chunk.contentHash[MODULE_TYPE] =
            /** @type {string} */
            (hash.digest(hashDigest)).substring(0, hashDigestLength);
        }
      });

      // All the code below is dedicated to the runtime and can be skipped when the `runtime` option is `false`
      if (!this.options.runtime) {
        return;
      }

      const { Template, RuntimeGlobals, RuntimeModule, runtime } = webpack;

      /**
       * @param {Chunk} mainChunk
       * @param {Compilation} compilation
       * @returns {TODO}
       */
      // eslint-disable-next-line no-shadow
      const getCssChunkObject = (mainChunk, compilation) => {
        /** @type {Record<string, number>} */
        const obj = {};
        const { chunkGraph } = compilation;

        for (const chunk of mainChunk.getAllAsyncChunks()) {
          const modules = chunkGraph.getOrderedChunkModulesIterable(
            chunk,
            compareModulesByIdentifier
          );

          for (const module of modules) {
            if (module.type === MODULE_TYPE) {
              obj[/** @type {string} */ (chunk.id)] = 1;

              break;
            }
          }
        }

        return obj;
      };

      class CssLoadingRuntimeModule extends RuntimeModule {
        /**
         * @param {Set<string>} runtimeRequirements
         * @param {TODO} runtimeOptions
         */
        constructor(runtimeRequirements, runtimeOptions) {
          super("css loading", 10);

          this.runtimeRequirements = runtimeRequirements;
          this.runtimeOptions = runtimeOptions;
        }

        generate() {
          const { chunk, runtimeRequirements } = this;
          const {
            runtimeTemplate,
            outputOptions: { crossOriginLoading },
          } = this.compilation;
          const chunkMap = getCssChunkObject(chunk, this.compilation);

          const withLoading =
            runtimeRequirements.has(RuntimeGlobals.ensureChunkHandlers) &&
            Object.keys(chunkMap).length > 0;
          const withHmr = runtimeRequirements.has(
            RuntimeGlobals.hmrDownloadUpdateHandlers
          );

          if (!withLoading && !withHmr) {
            return "";
          }

          return Template.asString([
            `var createStylesheet = ${runtimeTemplate.basicFunction(
              "chunkId, fullhref, resolve, reject",
              [
                'var linkTag = document.createElement("link");',
                this.runtimeOptions.attributes
                  ? Template.asString(
                      Object.entries(this.runtimeOptions.attributes).map(
                        (entry) => {
                          const [key, value] = entry;

                          return `linkTag.setAttribute(${JSON.stringify(
                            key
                          )}, ${JSON.stringify(value)});`;
                        }
                      )
                    )
                  : "",
                'linkTag.rel = "stylesheet";',
                this.runtimeOptions.linkType
                  ? `linkTag.type = ${JSON.stringify(
                      this.runtimeOptions.linkType
                    )};`
                  : "",
                `var onLinkComplete = ${runtimeTemplate.basicFunction("event", [
                  "// avoid mem leaks.",
                  "linkTag.onerror = linkTag.onload = null;",
                  "if (event.type === 'load') {",
                  Template.indent(["resolve();"]),
                  "} else {",
                  Template.indent([
                    "var errorType = event && (event.type === 'load' ? 'missing' : event.type);",
                    "var realHref = event && event.target && event.target.href || fullhref;",
                    'var err = new Error("Loading CSS chunk " + chunkId + " failed.\\n(" + realHref + ")");',
                    'err.code = "CSS_CHUNK_LOAD_FAILED";',
                    "err.type = errorType;",
                    "err.request = realHref;",
                    "linkTag.parentNode.removeChild(linkTag)",
                    "reject(err);",
                  ]),
                  "}",
                ])}`,
                "linkTag.onerror = linkTag.onload = onLinkComplete;",
                "linkTag.href = fullhref;",
                crossOriginLoading
                  ? Template.asString([
                      `if (linkTag.href.indexOf(window.location.origin + '/') !== 0) {`,
                      Template.indent(
                        `linkTag.crossOrigin = ${JSON.stringify(
                          crossOriginLoading
                        )};`
                      ),
                      "}",
                    ])
                  : "",
                typeof this.runtimeOptions.insert !== "undefined"
                  ? typeof this.runtimeOptions.insert === "function"
                    ? `(${this.runtimeOptions.insert.toString()})(linkTag)`
                    : Template.asString([
                        `var target = document.querySelector("${this.runtimeOptions.insert}");`,
                        `target.parentNode.insertBefore(linkTag, target.nextSibling);`,
                      ])
                  : Template.asString(["document.head.appendChild(linkTag);"]),
                "return linkTag;",
              ]
            )};`,
            `var findStylesheet = ${runtimeTemplate.basicFunction(
              "href, fullhref",
              [
                'var existingLinkTags = document.getElementsByTagName("link");',
                "for(var i = 0; i < existingLinkTags.length; i++) {",
                Template.indent([
                  "var tag = existingLinkTags[i];",
                  'var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");',
                  'if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return tag;',
                ]),
                "}",
                'var existingStyleTags = document.getElementsByTagName("style");',
                "for(var i = 0; i < existingStyleTags.length; i++) {",
                Template.indent([
                  "var tag = existingStyleTags[i];",
                  'var dataHref = tag.getAttribute("data-href");',
                  "if(dataHref === href || dataHref === fullhref) return tag;",
                ]),
                "}",
              ]
            )};`,
            `var loadStylesheet = ${runtimeTemplate.basicFunction(
              "chunkId",
              `return new Promise(${runtimeTemplate.basicFunction(
                "resolve, reject",
                [
                  `var href = ${RuntimeGlobals.require}.miniCssF(chunkId);`,
                  `var fullhref = ${RuntimeGlobals.publicPath} + href;`,
                  "if(findStylesheet(href, fullhref)) return resolve();",
                  "createStylesheet(chunkId, fullhref, resolve, reject);",
                ]
              )});`
            )}`,
            withLoading
              ? Template.asString([
                  "// object to store loaded CSS chunks",
                  "var installedCssChunks = {",
                  Template.indent(
                    /** @type {string[]} */
                    (chunk.ids)
                      .map((id) => `${JSON.stringify(id)}: 0`)
                      .join(",\n")
                  ),
                  "};",
                  "",
                  `${
                    RuntimeGlobals.ensureChunkHandlers
                  }.miniCss = ${runtimeTemplate.basicFunction(
                    "chunkId, promises",
                    [
                      `var cssChunks = ${JSON.stringify(chunkMap)};`,
                      "if(installedCssChunks[chunkId]) promises.push(installedCssChunks[chunkId]);",
                      "else if(installedCssChunks[chunkId] !== 0 && cssChunks[chunkId]) {",
                      Template.indent([
                        `promises.push(installedCssChunks[chunkId] = loadStylesheet(chunkId).then(${runtimeTemplate.basicFunction(
                          "",
                          "installedCssChunks[chunkId] = 0;"
                        )}, ${runtimeTemplate.basicFunction("e", [
                          "delete installedCssChunks[chunkId];",
                          "throw e;",
                        ])}));`,
                      ]),
                      "}",
                    ]
                  )};`,
                ])
              : "// no chunk loading",
            "",
            withHmr
              ? Template.asString([
                  "var oldTags = [];",
                  "var newTags = [];",
                  `var applyHandler = ${runtimeTemplate.basicFunction(
                    "options",
                    [
                      `return { dispose: ${runtimeTemplate.basicFunction("", [
                        "for(var i = 0; i < oldTags.length; i++) {",
                        Template.indent([
                          "var oldTag = oldTags[i];",
                          "if(oldTag.parentNode) oldTag.parentNode.removeChild(oldTag);",
                        ]),
                        "}",
                        "oldTags.length = 0;",
                      ])}, apply: ${runtimeTemplate.basicFunction("", [
                        'for(var i = 0; i < newTags.length; i++) newTags[i].rel = "stylesheet";',
                        "newTags.length = 0;",
                      ])} };`,
                    ]
                  )}`,
                  `${
                    RuntimeGlobals.hmrDownloadUpdateHandlers
                  }.miniCss = ${runtimeTemplate.basicFunction(
                    "chunkIds, removedChunks, removedModules, promises, applyHandlers, updatedModulesList",
                    [
                      "applyHandlers.push(applyHandler);",
                      `chunkIds.forEach(${runtimeTemplate.basicFunction(
                        "chunkId",
                        [
                          `var href = ${RuntimeGlobals.require}.miniCssF(chunkId);`,
                          `var fullhref = ${RuntimeGlobals.publicPath} + href;`,
                          "var oldTag = findStylesheet(href, fullhref);",
                          "if(!oldTag) return;",
                          `promises.push(new Promise(${runtimeTemplate.basicFunction(
                            "resolve, reject",
                            [
                              `var tag = createStylesheet(chunkId, fullhref, ${runtimeTemplate.basicFunction(
                                "",
                                [
                                  'tag.as = "style";',
                                  'tag.rel = "preload";',
                                  "resolve();",
                                ]
                              )}, reject);`,
                              "oldTags.push(oldTag);",
                              "newTags.push(tag);",
                            ]
                          )}));`,
                        ]
                      )});`,
                    ]
                  )}`,
                ])
              : "// no hmr",
          ]);
        }
      }

      const enabledChunks = new WeakSet();

      /**
       * @param {Chunk} chunk
       * @param {Set<string>} set
       */
      const handler = (chunk, set) => {
        if (enabledChunks.has(chunk)) {
          return;
        }

        enabledChunks.add(chunk);

        if (
          typeof this.options.chunkFilename === "string" &&
          /\[(full)?hash(:\d+)?\]/.test(this.options.chunkFilename)
        ) {
          set.add(RuntimeGlobals.getFullHash);
        }

        set.add(RuntimeGlobals.publicPath);

        compilation.addRuntimeModule(
          chunk,
          new runtime.GetChunkFilenameRuntimeModule(
            MODULE_TYPE,
            "mini-css",
            `${RuntimeGlobals.require}.miniCssF`,
            /**
             * @param {Chunk} referencedChunk
             * @returns {TODO}
             */
            (referencedChunk) => {
              if (!referencedChunk.contentHash[MODULE_TYPE]) {
                return false;
              }

              return referencedChunk.canBeInitial()
                ? this.options.filename
                : this.options.chunkFilename;
            },
            false
          )
        );

        compilation.addRuntimeModule(
          chunk,
          new CssLoadingRuntimeModule(set, this.runtimeOptions)
        );
      };

      compilation.hooks.runtimeRequirementInTree
        .for(RuntimeGlobals.ensureChunkHandlers)
        .tap(pluginName, handler);
      compilation.hooks.runtimeRequirementInTree
        .for(RuntimeGlobals.hmrDownloadUpdateHandlers)
        .tap(pluginName, handler);
    });
  }

  /**
   * @private
   * @param {Chunk} chunk
   * @param {ChunkGraph} chunkGraph
   * @returns {Iterable<Module>}
   */
  getChunkModules(chunk, chunkGraph) {
    return typeof chunkGraph !== "undefined"
      ? chunkGraph.getOrderedChunkModulesIterable(
          chunk,
          compareModulesByIdentifier
        )
      : chunk.modulesIterable;
  }

  /**
   * @private
   * @param {Compilation} compilation
   * @param {Chunk} chunk
   * @param {Iterable<Module>} modules
   * @param {Compilation["requestShortener"]} requestShortener
   * @returns {Set<Module & { content: Buffer, media: string, sourceMap?: Buffer, supports?: string, layer?: string }>}
   */
  sortModules(compilation, chunk, modules, requestShortener) {
    let usedModules = this._sortedModulesCache.get(chunk);

    if (usedModules || !modules) {
      return usedModules;
    }

    /** @type {Module[]} */
    const modulesList = [...modules];
    // Store dependencies for modules
    /** @type {Map<Module, Set<Module>>} */
    const moduleDependencies = new Map(
      modulesList.map((m) => [
        m,
        /** @type {Set<Module>} */
        (new Set()),
      ])
    );
    /** @type {Map<Module, Map<Module, Set<string>>>} */
    const moduleDependenciesReasons = new Map(
      modulesList.map((m) => [m, new Map()])
    );
    // Get ordered list of modules per chunk group
    // This loop also gathers dependencies from the ordered lists
    // Lists are in reverse order to allow to use Array.pop()
    /** @type {Module[][]} */
    const modulesByChunkGroup = Array.from(
      chunk.groupsIterable,
      (chunkGroup) => {
        const sortedModules = modulesList
          .map((module) => {
            return {
              module,
              index: chunkGroup.getModulePostOrderIndex(module),
            };
          })
          // eslint-disable-next-line no-undefined
          .filter((item) => item.index !== undefined)
          .sort((a, b) => b.index - a.index)
          .map((item) => item.module);

        for (let i = 0; i < sortedModules.length; i++) {
          const set = moduleDependencies.get(sortedModules[i]);
          const reasons = moduleDependenciesReasons.get(sortedModules[i]);

          for (let j = i + 1; j < sortedModules.length; j++) {
            const module = sortedModules[j];

            /** @type {Set<Module>} */
            (set).add(module);

            const reason =
              // @ts-ignore
              reasons.get(module) || /** @type {Set<Module>} */ (new Set());

            // @ts-ignore
            reason.add(chunkGroup);
            // @ts-ignore
            reasons.set(module, reason);
          }
        }

        return sortedModules;
      }
    );

    // set with already included modules in correct order
    usedModules = new Set();

    /**
     * @param {Module} m
     * @returns {boolean}
     */
    const unusedModulesFilter = (m) => !usedModules.has(m);

    while (usedModules.size < modulesList.length) {
      let success = false;
      let bestMatch;
      let bestMatchDeps;

      // get first module where dependencies are fulfilled
      for (const list of modulesByChunkGroup) {
        // skip and remove already added modules
        while (list.length > 0 && usedModules.has(list[list.length - 1])) {
          list.pop();
        }

        // skip empty lists
        if (list.length !== 0) {
          const module = list[list.length - 1];
          const deps = moduleDependencies.get(module);
          // determine dependencies that are not yet included
          const failedDeps = Array.from(
            /** @type {Set<Module>} */
            (deps)
          ).filter(unusedModulesFilter);

          // store best match for fallback behavior
          if (!bestMatchDeps || bestMatchDeps.length > failedDeps.length) {
            bestMatch = list;
            bestMatchDeps = failedDeps;
          }

          if (failedDeps.length === 0) {
            // use this module and remove it from list
            usedModules.add(list.pop());
            success = true;
            break;
          }
        }
      }

      if (!success) {
        // no module found => there is a conflict
        // use list with fewest failed deps
        // and emit a warning
        const fallbackModule = /** @type {Module[]} */ (bestMatch).pop();

        if (!this.options.ignoreOrder) {
          const reasons = moduleDependenciesReasons.get(
            /** @type {Module} */ (fallbackModule)
          );

          compilation.warnings.push(
            /** @type {WebpackError} */
            (
              new Error(
                [
                  `chunk ${chunk.name || chunk.id} [${pluginName}]`,
                  "Conflicting order. Following module has been added:",
                  ` * ${
                    /** @type {Module} */ (fallbackModule).readableIdentifier(
                      requestShortener
                    )
                  }`,
                  "despite it was not able to fulfill desired ordering with these modules:",
                  .../** @type {Module[]} */ (bestMatchDeps).map((m) => {
                    const goodReasonsMap = moduleDependenciesReasons.get(m);
                    const goodReasons =
                      // @ts-ignore
                      goodReasonsMap && goodReasonsMap.get(fallbackModule);
                    const failedChunkGroups = Array.from(
                      // @ts-ignore
                      /** @type {Map<Module, Set<Chunk>>} */ (reasons).get(m),
                      (cg) => cg.name
                    ).join(", ");
                    const goodChunkGroups =
                      goodReasons &&
                      // @ts-ignore
                      Array.from(goodReasons, (cg) => cg.name).join(", ");
                    return [
                      ` * ${m.readableIdentifier(requestShortener)}`,
                      `   - couldn't fulfill desired order of chunk group(s) ${failedChunkGroups}`,
                      goodChunkGroups &&
                        `   - while fulfilling desired order of chunk group(s) ${goodChunkGroups}`,
                    ]
                      .filter(Boolean)
                      .join("\n");
                  }),
                ].join("\n")
              )
            )
          );
        }

        usedModules.add(fallbackModule);
      }
    }

    this._sortedModulesCache.set(chunk, usedModules);

    return usedModules;
  }

  /**
   * @private
   * @param {Compiler} compiler
   * @param {Compilation} compilation
   * @param {Chunk} chunk
   * @param {Iterable<Module>} modules
   * @param {Compiler["requestShortener"]} requestShortener
   * @param {string} filenameTemplate
   * @param {Parameters<Exclude<Required<Configuration>['output']['filename'], string | undefined>>[0]} pathData
   * @returns {Source}
   */
  renderContentAsset(
    compiler,
    compilation,
    chunk,
    modules,
    requestShortener,
    filenameTemplate,
    pathData
  ) {
    const usedModules = this.sortModules(
      compilation,
      chunk,
      modules,
      requestShortener
    );

    const { ConcatSource, SourceMapSource, RawSource } =
      compiler.webpack.sources;
    const source = new ConcatSource();
    const externalsSource = new ConcatSource();

    for (const module of usedModules) {
      let content = module.content.toString();

      const readableIdentifier = module.readableIdentifier(requestShortener);
      const startsWithAtRuleImport = /^@import url/.test(content);

      let header;

      if (compilation.outputOptions.pathinfo) {
        // From https://github.com/webpack/webpack/blob/29eff8a74ecc2f87517b627dee451c2af9ed3f3f/lib/ModuleInfoHeaderPlugin.js#L191-L194
        const reqStr = readableIdentifier.replace(/\*\//g, "*_/");
        const reqStrStar = "*".repeat(reqStr.length);
        const headerStr = `/*!****${reqStrStar}****!*\\\n  !*** ${reqStr} ***!\n  \\****${reqStrStar}****/\n`;

        header = new RawSource(headerStr);
      }

      if (startsWithAtRuleImport) {
        if (typeof header !== "undefined") {
          externalsSource.add(header);
        }

        // HACK for IE
        // http://stackoverflow.com/a/14676665/1458162
        if (module.media) {
          // insert media into the @import
          // this is rar
          // TODO improve this and parse the CSS to support multiple medias
          content = content.replace(/;|\s*$/, module.media);
        }

        externalsSource.add(content);
        externalsSource.add("\n");
      } else {
        if (typeof header !== "undefined") {
          source.add(header);
        }

        if (module.supports) {
          source.add(`@supports (${module.supports}) {\n`);
        }

        if (module.media) {
          source.add(`@media ${module.media} {\n`);
        }

        const needLayer = typeof module.layer !== "undefined";

        if (needLayer) {
          source.add(
            `@layer${module.layer.length > 0 ? ` ${module.layer}` : ""} {\n`
          );
        }

        const { path: filename } = compilation.getPathWithInfo(
          filenameTemplate,
          pathData
        );

        const undoPath = getUndoPath(filename, compiler.outputPath, false);

        content = content.replace(new RegExp(ABSOLUTE_PUBLIC_PATH, "g"), "");
        content = content.replace(
          new RegExp(SINGLE_DOT_PATH_SEGMENT, "g"),
          "."
        );
        content = content.replace(new RegExp(AUTO_PUBLIC_PATH, "g"), undoPath);

        if (module.sourceMap) {
          source.add(
            new SourceMapSource(
              content,
              readableIdentifier,
              module.sourceMap.toString()
            )
          );
        } else {
          source.add(new RawSource(content));
        }

        source.add("\n");

        if (needLayer) {
          source.add("}\n");
        }

        if (module.media) {
          source.add("}\n");
        }

        if (module.supports) {
          source.add("}\n");
        }
      }
    }

    return new ConcatSource(externalsSource, source);
  }
}

MiniCssExtractPlugin.loader = require.resolve("./loader");

export default MiniCssExtractPlugin;
