import path from 'path';

import loaderUtils from 'loader-utils';
import { validate } from 'schema-utils';

import { AUTO_PUBLIC_PATH, findModuleById, evalModuleCode } from './utils';
import schema from './loader-options.json';

import MiniCssExtractPlugin, { pluginName, pluginSymbol } from './index';

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

  const callback = this.async();

  if (!this[pluginSymbol]) {
    callback(
      new Error(
        "You forgot to add 'mini-css-extract-plugin' plugin (i.e. `{ plugins: [new MiniCssExtractPlugin()] }`), please read https://github.com/webpack-contrib/mini-css-extract-plugin#getting-started"
      )
    );

    return;
  }

  const loaders = this.loaders.slice(this.loaderIndex + 1);

  this.addDependency(this.resourcePath);

  const childFilename = '*';
  const publicPath =
    typeof options.publicPath === 'string'
      ? options.publicPath === 'auto' || options.publicPath === ''
        ? AUTO_PUBLIC_PATH
        : options.publicPath === '' || options.publicPath.endsWith('/')
        ? options.publicPath
        : `${options.publicPath}/`
      : typeof options.publicPath === 'function'
      ? options.publicPath(this.resourcePath, this.rootContext)
      : this._compilation.outputOptions.publicPath === 'auto' || this._compilation.outputOptions.publicPath === ''
      ? AUTO_PUBLIC_PATH
      : this._compilation.outputOptions.publicPath;

  const outputOptions = {
    filename: childFilename,
    publicPath,
  };

  const childCompiler = this._compilation.createChildCompiler(
    `${pluginName} ${request}`,
    outputOptions
  );

  // TODO simplify after drop  webpack v4
  // eslint-disable-next-line global-require
  const webpack = this._compiler.webpack || require('webpack');

  const { NodeTemplatePlugin } = webpack.node;
  const NodeTargetPlugin = webpack.node.NodeTargetPlugin
    ? webpack.node.NodeTargetPlugin
    : // eslint-disable-next-line global-require
      require('webpack/lib/node/NodeTargetPlugin');

  new NodeTemplatePlugin(outputOptions).apply(childCompiler);
  new NodeTargetPlugin().apply(childCompiler);

  const { EntryOptionPlugin } = webpack;

  if (EntryOptionPlugin) {
    const {
      library: { EnableLibraryPlugin },
    } = webpack;

    new EnableLibraryPlugin('commonjs2').apply(childCompiler);

    EntryOptionPlugin.applyEntryOption(childCompiler, this.context, {
      child: {
        library: {
          type: 'commonjs2',
        },
        import: [`!!${request}`],
      },
    });
  } else {
    const { LibraryTemplatePlugin, SingleEntryPlugin } = webpack;

    new LibraryTemplatePlugin(null, 'commonjs2').apply(childCompiler);
    new SingleEntryPlugin(this.context, `!!${request}`, pluginName).apply(
      childCompiler
    );
  }

  const { LimitChunkCountPlugin } = webpack.optimize;

  new LimitChunkCountPlugin({ maxChunks: 1 }).apply(childCompiler);

  const NormalModule = webpack.NormalModule
    ? webpack.NormalModule
    : // eslint-disable-next-line global-require
      require('webpack/lib/NormalModule');

  childCompiler.hooks.thisCompilation.tap(
    `${pluginName} loader`,
    (compilation) => {
      const normalModuleHook =
        typeof NormalModule.getCompilationHooks !== 'undefined'
          ? NormalModule.getCompilationHooks(compilation).loader
          : compilation.hooks.normalModuleLoader;

      normalModuleHook.tap(`${pluginName} loader`, (loaderContext, module) => {
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

        // console.log(source);

        // Remove all chunk assets
        compilation.chunks.forEach((chunk) => {
          chunk.files.forEach((file) => {
            compilation.deleteAsset(file);
          });
        });
      });
    });
  }

  childCompiler.runAsChild((error, entries, compilation) => {
    const assets = Object.create(null);
    const assetsInfo = new Map();

    for (const asset of compilation.getAssets()) {
      assets[asset.name] = asset.source;
      assetsInfo.set(asset.name, asset.info);
    }

    const addDependencies = (dependencies) => {
      if (!Array.isArray(dependencies) && dependencies != null) {
        throw new Error(
          `Exported value was not extracted as an array: ${JSON.stringify(
            dependencies
          )}`
        );
      }

      const identifierCountMap = new Map();

      let lastDep;

      for (const dependency of dependencies) {
        if (!dependency.identifier) {
          // eslint-disable-next-line no-continue
          continue;
        }

        const count = identifierCountMap.get(dependency.identifier) || 0;
        const CssDependency = MiniCssExtractPlugin.getCssDependency(webpack);

        this._module.addDependency(
          (lastDep = new CssDependency(dependency, dependency.context, count))
        );
        identifierCountMap.set(dependency.identifier, count + 1);
      }

      if (lastDep) {
        lastDep.assets = assets;
        lastDep.assetsInfo = assetsInfo;
      }
    };

    if (error) {
      return callback(error);
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
            content: Buffer.from(content),
            media,
            sourceMap: sourceMap
              ? Buffer.from(JSON.stringify(sourceMap))
              : // eslint-disable-next-line no-undefined
                undefined,
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
