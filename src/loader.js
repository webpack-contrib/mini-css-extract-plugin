import path from 'path';

import loaderUtils from 'loader-utils';
import NodeTemplatePlugin from 'webpack/lib/node/NodeTemplatePlugin';
import NodeTargetPlugin from 'webpack/lib/node/NodeTargetPlugin';
import LibraryTemplatePlugin from 'webpack/lib/LibraryTemplatePlugin';
import SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin';
import LimitChunkCountPlugin from 'webpack/lib/optimize/LimitChunkCountPlugin';
import NormalModule from 'webpack/lib/NormalModule';
import { validate } from 'schema-utils';

import CssDependency from './CssDependency';
import { findModuleById, evalModuleCode } from './utils';
import schema from './loader-options.json';

const pluginName = 'mini-css-extract-plugin';

function hotLoader(content, context) {
  const accept = context.locals
    ? ''
    : 'module.hot.accept(undefined, cssReload);';

  return `${content}
    if(module.hot) {
      // ${Date.now()}
      var cssReload = require(${loaderUtils.stringifyRequest(
        context.context,
        path.join(__dirname, 'hmr/hotModuleReplacement.js')
      )})(module.id, ${JSON.stringify({
    ...context.options,
    locals: !!context.locals,
  })});
      module.hot.dispose(cssReload);
      ${accept}
    }
  `;
}

export function pitch(request) {
  const options = loaderUtils.getOptions(this) || {};

  validate(schema, options, {
    name: 'Mini CSS Extract Plugin Loader',
    baseDataPath: 'options',
  });

  const loaders = this.loaders.slice(this.loaderIndex + 1);

  this.addDependency(this.resourcePath);

  const childFilename = '*';
  const publicPath =
    typeof options.publicPath === 'string'
      ? options.publicPath === '' || options.publicPath.endsWith('/')
        ? options.publicPath
        : `${options.publicPath}/`
      : typeof options.publicPath === 'function'
      ? options.publicPath(this.resourcePath, this.rootContext)
      : this._compilation.outputOptions.publicPath;
  const outputOptions = {
    filename: childFilename,
    publicPath,
  };
  const childCompiler = this._compilation.createChildCompiler(
    `${pluginName} ${request}`,
    outputOptions
  );

  new NodeTemplatePlugin(outputOptions).apply(childCompiler);
  new LibraryTemplatePlugin(null, 'commonjs2').apply(childCompiler);
  new NodeTargetPlugin().apply(childCompiler);
  new SingleEntryPlugin(this.context, `!!${request}`, pluginName).apply(
    childCompiler
  );
  new LimitChunkCountPlugin({ maxChunks: 1 }).apply(childCompiler);

  childCompiler.hooks.thisCompilation.tap(
    `${pluginName} loader`,
    (compilation) => {
      const normalModuleHook =
        typeof NormalModule.getCompilationHooks !== 'undefined'
          ? NormalModule.getCompilationHooks(compilation).loader
          : compilation.hooks.normalModuleLoader;

      normalModuleHook.tap(`${pluginName} loader`, (loaderContext, module) => {
        // eslint-disable-next-line no-param-reassign
        loaderContext.emitFile = this.emitFile;

        if (module.request === request) {
          // eslint-disable-next-line no-param-reassign
          module.loaders = loaders.map((loader) => {
            return {
              loader: loader.path,
              options: loader.options,
              ident: loader.ident,
            };
          });
        }
      });
    }
  );

  let source;

  const isWebpack4 = childCompiler.webpack
    ? false
    : typeof childCompiler.resolvers !== 'undefined';

  if (isWebpack4) {
    childCompiler.hooks.afterCompile.tap(pluginName, (compilation) => {
      source =
        compilation.assets[childFilename] &&
        compilation.assets[childFilename].source();

      // Remove all chunk assets
      compilation.chunks.forEach((chunk) => {
        chunk.files.forEach((file) => {
          delete compilation.assets[file]; // eslint-disable-line no-param-reassign
        });
      });
    });
  } else {
    childCompiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(pluginName, () => {
        source =
          compilation.assets[childFilename] &&
          compilation.assets[childFilename].source();

        // Remove all chunk assets
        compilation.chunks.forEach((chunk) => {
          chunk.files.forEach((file) => {
            compilation.deleteAsset(file);
          });
        });
      });
    });
  }

  const callback = this.async();

  childCompiler.runAsChild((err, entries, compilation) => {
    const addDependencies = (dependencies) => {
      if (!Array.isArray(dependencies) && dependencies != null) {
        throw new Error(
          `Exported value was not extracted as an array: ${JSON.stringify(
            dependencies
          )}`
        );
      }

      const identifierCountMap = new Map();

      for (const dependency of dependencies) {
        if (!dependency.identifier) {
          // eslint-disable-next-line no-continue
          continue;
        }

        const count = identifierCountMap.get(dependency.identifier) || 0;

        this._module.addDependency(
          new CssDependency(dependency, dependency.context, count)
        );
        identifierCountMap.set(dependency.identifier, count + 1);
      }
    };

    if (err) {
      return callback(err);
    }

    if (compilation.errors.length > 0) {
      return callback(compilation.errors[0]);
    }

    compilation.fileDependencies.forEach((dep) => {
      this.addDependency(dep);
    }, this);

    compilation.contextDependencies.forEach((dep) => {
      this.addContextDependency(dep);
    }, this);

    if (!source) {
      return callback(new Error("Didn't get a result from child compiler"));
    }

    let locals;

    const esModule =
      typeof options.esModule !== 'undefined' ? options.esModule : true;
    const namedExport =
      esModule && options.modules && options.modules.namedExport;

    try {
      const originalExports = evalModuleCode(this, source, request);

      // eslint-disable-next-line no-underscore-dangle
      exports = originalExports.__esModule
        ? originalExports.default
        : originalExports;

      if (namedExport) {
        Object.keys(originalExports).forEach((key) => {
          if (key !== 'default') {
            if (!locals) {
              locals = {};
            }

            locals[key] = originalExports[key];
          }
        });
      } else {
        locals = exports && exports.locals;
      }

      let dependencies;

      if (!Array.isArray(exports)) {
        dependencies = [[null, exports]];
      } else {
        dependencies = exports.map(([id, content, media, sourceMap]) => {
          const module = findModuleById(compilation, id);

          return {
            identifier: module.identifier(),
            context: module.context,
            content,
            media,
            sourceMap,
          };
        });
      }

      addDependencies(dependencies);
    } catch (e) {
      return callback(e);
    }

    const result = locals
      ? namedExport
        ? Object.keys(locals)
            .map(
              (key) => `\nexport const ${key} = ${JSON.stringify(locals[key])};`
            )
            .join('')
        : `\n${
            esModule ? 'export default' : 'module.exports ='
          } ${JSON.stringify(locals)};`
      : esModule
      ? `\nexport {};`
      : '';

    let resultSource = `// extracted by ${pluginName}`;

    resultSource += this.hot
      ? hotLoader(result, { context: this.context, options, locals })
      : result;

    return callback(null, resultSource);
  });
}

// eslint-disable-next-line func-names
export default function () {}
