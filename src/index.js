import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import sources from 'webpack-sources';

const { ConcatSource, SourceMapSource, OriginalSource } = sources;
const { Template } = webpack;

const NS = path.dirname(fs.realpathSync(__filename));

class CssDependency extends webpack.Dependency {
  constructor({ identifier, content, media, sourceMap }, context, identifierIndex) {
    super();
    this.identifier = identifier;
    this.identifierIndex = identifierIndex;
    this.content = content;
    this.media = media;
    this.sourceMap = sourceMap;
    this.context = context;
  }

  getResourceIdentifier() {
    return `css-module-${this.identifier}-${this.identifierIndex}`;
  }
}

class CssDependencyTemplate {
  apply() {}
}

class CssModule extends webpack.Module {
  constructor(dependency) {
    super(NS, dependency.context);
    this._identifier = dependency.identifier;
    this._identifierIndex = dependency.identifierIndex;
    this.content = dependency.content;
    this.media = dependency.media;
    this.sourceMap = dependency.sourceMap;
  }

  // no source() so webpack doesn't do add stuff to the bundle

  size() {
    return this.content.length;
  }

  identifier() {
    return `css ${this._identifier} ${this._identifierIndex}`;
  }

  readableIdentifier(requestShortener) {
    return `css ${requestShortener.shorten(this._identifier)}${this._identifierIndex ? ` (${this._identifierIndex})` : ''}`;
  }

  build(options, compilation, resolver, fileSystem, callback) {
    this.buildInfo = {};
    this.buildMeta = {};
    callback();
  }
}

class CssModuleFactory {
  create({ dependencies: [dependency] }, callback) {
    callback(null, new CssModule(dependency));
  }
}

class MiniCssExtractPlugin {
  constructor(options) {
    this.options = Object.assign({
      filename: '[name].css',
    }, options);
    if (!this.options.chunkFilename) {
      const { filename } = this.options;
      const hasName = filename.includes('[name]');
      const hasId = filename.includes('[id]');
      const hasChunkHash = filename.includes('[chunkhash]');
      // Anything changing depending on chunk is fine
      if (hasChunkHash || hasName || hasId) {
        this.options.chunkFilename = filename;
      } else {
        // Elsewise prefix '[id].' in front of the basename to make it changing
        this.options.chunkFilename = filename.replace(/(^|\/)([^/]*(?:\?|$))/, '$1[id].$2');
      }
    }
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap('mini-css-extract-plugin', (compilation) => {
      compilation.hooks.normalModuleLoader.tap('mini-css-extract-plugin', (lc, m) => {
        const loaderContext = lc;
        const module = m;
        loaderContext[NS] = (content) => {
          if (!Array.isArray(content) && content != null) {
            throw new Error(`Exported value was not extracted as an array: ${JSON.stringify(content)}`);
          }
          const identifierCountMap = new Map();
          for (const line of content) {
            const count = identifierCountMap.get(line.identifier) || 0;
            module.addDependency(new CssDependency(line, m.context, count));
            identifierCountMap.set(line.identifier, count + 1);
          }
        };
      });
      compilation.dependencyFactories.set(CssDependency, new CssModuleFactory());
      compilation.dependencyTemplates.set(CssDependency, new CssDependencyTemplate());
      compilation.mainTemplate.hooks.renderManifest.tap('mini-css-extract-plugin', (result, { chunk }) => {
        const renderedModules = Array.from(chunk.modulesIterable).filter(module => module.type === NS);
        if (renderedModules.length > 0) {
          result.push({
            render: () => this.renderContentAsset(renderedModules, compilation.runtimeTemplate.requestShortener),
            filenameTemplate: this.options.filename,
            pathOptions: {
              chunk,
            },
            identifier: `mini-css-extract-plugin.${chunk.id}`,
          });
        }
      });
      compilation.chunkTemplate.hooks.renderManifest.tap('mini-css-extract-plugin', (result, { chunk }) => {
        const renderedModules = Array.from(chunk.modulesIterable).filter(module => module.type === NS);
        if (renderedModules.length > 0) {
          result.push({
            render: () => this.renderContentAsset(renderedModules, compilation.runtimeTemplate.requestShortener),
            filenameTemplate: this.options.chunkFilename,
            pathOptions: {
              chunk,
            },
            identifier: `mini-css-extract-plugin.${chunk.id}`,
          });
        }
      });
      const { mainTemplate } = compilation;
      mainTemplate.hooks.localVars.tap(
        'mini-css-extract-plugin',
        (source, chunk) => {
          const chunkMap = this.getCssChunkObject(chunk);
          if (Object.keys(chunkMap).length > 0) {
            return Template.asString([
              source,
              '',
              '// object to store loaded CSS chunks',
              'var installedCssChunks = {',
              Template.indent(
                chunk.ids.map(id => `${JSON.stringify(id)}: 0`).join(',\n'),
              ),
              '}',
            ]);
          }
          return source;
        },
      );
      mainTemplate.hooks.requireEnsure.tap(
        'mini-css-extract-plugin',
        (source, chunk, hash) => {
          const chunkMap = this.getCssChunkObject(chunk);
          if (Object.keys(chunkMap).length > 0) {
            const chunkMaps = chunk.getChunkMaps();
            const linkHrefPath = mainTemplate.getAssetPath(
              JSON.stringify(this.options.chunkFilename),
              {
                hash: `" + ${mainTemplate.renderCurrentHashCode(hash)} + "`,
                hashWithLength: length =>
                  `" + ${mainTemplate.renderCurrentHashCode(hash, length)} + "`,
                chunk: {
                  id: '" + chunkId + "',
                  hash: `" + ${JSON.stringify(chunkMaps.hash)}[chunkId] + "`,
                  hashWithLength(length) {
                    const shortChunkHashMap = Object.create(null);
                    for (const chunkId of Object.keys(chunkMaps.hash)) {
                      if (typeof chunkMaps.hash[chunkId] === 'string') {
                        shortChunkHashMap[chunkId] = chunkMaps.hash[chunkId].substr(0, length);
                      }
                    }
                    return `" + ${JSON.stringify(shortChunkHashMap)}[chunkId] + "`;
                  },
                  name: `" + (${JSON.stringify(chunkMaps.name)}[chunkId]||chunkId) + "`,
                },
              },
            );
            return Template.asString([
              source,
              '',
              '// mini-css-extract-plugin CSS loading',
              `var cssChunks = ${JSON.stringify(chunkMap)};`,
              'if(installedCssChunks[chunkId]) promises.push(installedCssChunks[chunkId]);',
              'else if(installedCssChunks[chunkId] !== 0 && cssChunks[chunkId]) {',
              Template.indent([
                'promises.push(installedCssChunks[chunkId] = new Promise(function(resolve, reject) {',
                Template.indent([
                  'var linkTag = document.createElement("link");',
                  'linkTag.rel = "stylesheet";',
                  'linkTag.onload = resolve;',
                  'linkTag.onerror = reject;',
                  `linkTag.href = ${mainTemplate.requireFn}.p + ${linkHrefPath};`,
                  'var head = document.getElementsByTagName("head")[0];',
                  'head.appendChild(linkTag);',
                  'installedCssChunks[chunkId] = 0;',
                ]),
                '}));',
              ]),
              '}',
            ]);
          }
          return source;
        });
    });
  }

  getCssChunkObject(mainChunk) {
    const obj = {};
    for (const chunk of mainChunk.getAllAsyncChunks()) {
      for (const module of chunk.modulesIterable) {
        if (module.type === NS) {
          obj[chunk.id] = 1;
          break;
        }
      }
    }
    return obj;
  }

  renderContentAsset(modules, requestShortener) {
    modules.sort((a, b) => a.index2 - b.index2);
    const source = new ConcatSource();
    const externalsSource = new ConcatSource();
    for (const m of modules) {
      if (/^@import url/.test(m.content)) {
        // HACK for IE
        // http://stackoverflow.com/a/14676665/1458162
        let { content } = m;
        if (m.media) {
          // insert media into the @import
          // this is rar
          // TODO improve this and parse the CSS to support multiple medias
          content = content.replace(/;|\s*$/, m.media);
        }
        externalsSource.add(content);
        externalsSource.add('\n');
      } else {
        if (m.media) {
          source.add(`@media ${m.media} {\n`);
        }
        if (m.sourceMap) {
          source.add(new SourceMapSource(m.content, m.readableIdentifier(requestShortener), m.sourceMap));
        } else {
          source.add(new OriginalSource(m.content, m.readableIdentifier(requestShortener)));
        }
        source.add('\n');
        if (m.media) {
          source.add('}\n');
        }
      }
    }
    return new ConcatSource(externalsSource, source);
  }
}

MiniCssExtractPlugin.loader = require.resolve('./loader');

export default MiniCssExtractPlugin;
