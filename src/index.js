/* eslint-disable class-methods-use-this */

import webpack from 'webpack';

import CssModuleFactory from './CssModuleFactory';
import CssDependencyTemplate from './CssDependencyTemplate';
import CssDependency from './CssDependency';
import schema from './plugin-options.json';
import { MODULE_TYPE, compareModulesByIdentifier } from './utils';

const {
  Template,
  util: { createHash },
} = webpack;

const pluginName = 'mini-css-extract-plugin';

const DEFAULT_FILENAME = '[name].css';

class MiniCssExtractPlugin {
  constructor(options = {}) {
    webpack.validateSchema(schema, options, {
      name: 'Mini CSS Extract Plugin',
      baseDataPath: 'options',
    });

    const insert =
      typeof options.insert !== 'undefined'
        ? typeof options.insert === 'function'
          ? `(${options.insert.toString()})(linkTag)`
          : Template.asString([
              `var target = document.querySelector("${options.insert}");`,
              `target.parentNode.insertBefore(linkTag, target.nextSibling);`,
            ])
        : Template.asString(['document.head.appendChild(linkTag);']);

    const attributes =
      typeof options.attributes === 'object' ? options.attributes : {};

    // Todo in next major release set default to "false"
    const linkType =
      options.linkType === true || typeof options.linkType === 'undefined'
        ? 'text/css'
        : options.linkType;

    this.options = Object.assign(
      {
        filename: DEFAULT_FILENAME,
        ignoreOrder: false,
      },
      options
    );

    this.runtimeOptions = {
      insert,
      linkType,
    };

    this.runtimeOptions.attributes = Template.asString(
      Object.entries(attributes).map((entry) => {
        const [key, value] = entry;

        return `linkTag.setAttribute(${JSON.stringify(key)}, ${JSON.stringify(
          value
        )});`;
      })
    );

    if (!this.options.chunkFilename) {
      const { filename } = this.options;

      if (typeof filename !== 'function') {
        const hasName = filename.includes('[name]');
        const hasId = filename.includes('[id]');
        const hasChunkHash = filename.includes('[chunkhash]');
        const hasContentHash = filename.includes('[contenthash]');

        // Anything changing depending on chunk is fine
        if (hasChunkHash || hasContentHash || hasName || hasId) {
          this.options.chunkFilename = filename;
        } else {
          // Otherwise prefix "[id]." in front of the basename to make it changing
          this.options.chunkFilename = filename.replace(
            /(^|\/)([^/]*(?:\?|$))/,
            '$1[id].$2'
          );
        }
      } else {
        this.options.chunkFilename = '[id].css';
      }
    }
  }

  /** @param {import("webpack").Compiler} compiler */
  apply(compiler) {
    const { splitChunks } = compiler.options.optimization;
    if (splitChunks) {
      if (splitChunks.defaultSizeTypes.includes('...')) {
        splitChunks.defaultSizeTypes.push(MODULE_TYPE);
      }
    }

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.dependencyFactories.set(
        CssDependency,
        new CssModuleFactory()
      );

      compilation.dependencyTemplates.set(
        CssDependency,
        new CssDependencyTemplate()
      );

      compilation.hooks.renderManifest.tap(pluginName, (result, { chunk }) => {
        const { chunkGraph } = compilation;

        // We don't need hot update chunks for css
        // We will use the real asset instead to update
        if (chunk instanceof webpack.HotUpdateChunk) {
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
                compilation.runtimeTemplate.requestShortener
              ),
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
        const { hashFunction, hashDigest, hashDigestLength } = outputOptions;
        const hash = createHash(hashFunction);

        for (const m of this.getChunkModules(chunk, chunkGraph)) {
          if (m.type === MODULE_TYPE) {
            m.updateHash(hash, { chunkGraph });
          }
        }

        const { contentHash } = chunk;

        contentHash[MODULE_TYPE] = hash
          .digest(hashDigest)
          .substring(0, hashDigestLength);
      });

      const enabledChunks = new WeakSet();
      const handler = (chunk, set) => {
        if (enabledChunks.has(chunk)) {
          return;
        }

        enabledChunks.add(chunk);

        // eslint-disable-next-line global-require
        const CssLoadingRuntimeModule = require('./CssLoadingRuntimeModule');

        set.add(webpack.RuntimeGlobals.publicPath);
        compilation.addRuntimeModule(
          chunk,
          new webpack.runtime.GetChunkFilenameRuntimeModule(
            MODULE_TYPE,
            'mini-css',
            `${webpack.RuntimeGlobals.require}.miniCssF`,
            (referencedChunk) =>
              referencedChunk.canBeInitial()
                ? this.options.filename
                : this.options.chunkFilename,
            true
          )
        );
        compilation.addRuntimeModule(
          chunk,
          new CssLoadingRuntimeModule(set, this.runtimeOptions)
        );
      };
      compilation.hooks.runtimeRequirementInTree
        .for(webpack.RuntimeGlobals.ensureChunkHandlers)
        .tap(pluginName, handler);
      compilation.hooks.runtimeRequirementInTree
        .for(webpack.RuntimeGlobals.hmrDownloadUpdateHandlers)
        .tap(pluginName, handler);
    });
  }

  getChunkModules(chunk, chunkGraph) {
    return chunkGraph.getOrderedChunkModulesIterable(
      chunk,
      compareModulesByIdentifier
    );
  }

  renderContentAsset(compiler, compilation, chunk, modules, requestShortener) {
    const {
      ConcatSource,
      SourceMapSource,
      RawSource,
    } = compiler.webpack.sources;
    const moduleIndexFunctionName =
      typeof compilation.chunkGraph !== 'undefined'
        ? 'getModulePostOrderIndex'
        : 'getModuleIndex2';

    // Store dependencies for modules
    const moduleDependencies = new Map(modules.map((m) => [m, new Set()]));
    const moduleDependenciesReasons = new Map(
      modules.map((m) => [m, new Map()])
    );

    // Get ordered list of modules per chunk group
    // This loop also gathers dependencies from the ordered lists
    // Lists are in reverse order to allow to use Array.pop()
    const modulesByChunkGroup = Array.from(chunk.groupsIterable, (cg) => {
      const sortedModules = modules
        .map((m) => {
          return {
            module: m,
            index: cg[moduleIndexFunctionName](m),
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
          set.add(module);
          const reason = reasons.get(module) || new Set();
          reason.add(cg);
          reasons.set(module, reason);
        }
      }

      return sortedModules;
    });

    // set with already included modules in correct order
    const usedModules = new Set();

    const unusedModulesFilter = (m) => !usedModules.has(m);

    while (usedModules.size < modules.length) {
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
          const failedDeps = Array.from(deps).filter(unusedModulesFilter);

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
        const fallbackModule = bestMatch.pop();

        if (!this.options.ignoreOrder) {
          const reasons = moduleDependenciesReasons.get(fallbackModule);
          compilation.warnings.push(
            new Error(
              [
                `chunk ${chunk.name || chunk.id} [${pluginName}]`,
                'Conflicting order. Following module has been added:',
                ` * ${fallbackModule.readableIdentifier(requestShortener)}`,
                'despite it was not able to fulfill desired ordering with these modules:',
                ...bestMatchDeps.map((m) => {
                  const goodReasonsMap = moduleDependenciesReasons.get(m);
                  const goodReasons =
                    goodReasonsMap && goodReasonsMap.get(fallbackModule);
                  const failedChunkGroups = Array.from(
                    reasons.get(m),
                    (cg) => cg.name
                  ).join(', ');
                  const goodChunkGroups =
                    goodReasons &&
                    Array.from(goodReasons, (cg) => cg.name).join(', ');
                  return [
                    ` * ${m.readableIdentifier(requestShortener)}`,
                    `   - couldn't fulfill desired order of chunk group(s) ${failedChunkGroups}`,
                    goodChunkGroups &&
                      `   - while fulfilling desired order of chunk group(s) ${goodChunkGroups}`,
                  ]
                    .filter(Boolean)
                    .join('\n');
                }),
              ].join('\n')
            )
          );
        }

        usedModules.add(fallbackModule);
      }
    }

    const source = new ConcatSource();
    const externalsSource = new ConcatSource();

    for (const m of usedModules) {
      let content = m.content.toString();

      if (/^@import url/.test(content)) {
        // HACK for IE
        // http://stackoverflow.com/a/14676665/1458162
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
          source.add(
            new SourceMapSource(
              content,
              m.readableIdentifier(requestShortener),
              m.sourceMap.toString()
            )
          );
        } else {
          source.add(
            new RawSource(content, m.readableIdentifier(requestShortener))
          );
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
