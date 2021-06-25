import path from 'path';

import loaderUtils from 'loader-utils';
import { validate } from 'schema-utils';

import { findModuleById, evalModuleCode } from './utils';
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

  const optionsFromPlugin = this[pluginSymbol];
  if (!optionsFromPlugin) {
    callback(
      new Error(
        "You forgot to add 'mini-css-extract-plugin' plugin (i.e. `{ plugins: [new MiniCssExtractPlugin()] }`), please read https://github.com/webpack-contrib/mini-css-extract-plugin#getting-started"
      )
    );

    return;
  }

  // TODO simplify after drop  webpack v4
  // eslint-disable-next-line global-require
  const webpack = this._compiler.webpack || require('webpack');

  const handleExports = (originalExports, compilation, assets, assetsInfo) => {
    let locals;
    let namedExport;

    const esModule =
      typeof options.esModule !== 'undefined' ? options.esModule : true;
    const addDependencies = (dependencies) => {
      if (!Array.isArray(dependencies) && dependencies != null) {
        throw new Error(
          `Exported value was not extracted as an array: ${JSON.stringify(
            dependencies
          )}`
        );
      }

      const identifierCountMap = new Map();
      const emit = typeof options.emit !== 'undefined' ? options.emit : true;
      let lastDep;

      for (const dependency of dependencies) {
        if (!dependency.identifier || !emit) {
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

      if (lastDep && assets) {
        lastDep.assets = assets;
        lastDep.assetsInfo = assetsInfo;
      }
    };

    try {
      // eslint-disable-next-line no-underscore-dangle
      const exports = originalExports.__esModule
        ? originalExports.default
        : originalExports;

      namedExport =
        // eslint-disable-next-line no-underscore-dangle
        originalExports.__esModule && !('locals' in originalExports.default);

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
          let identifier = id;
          let context;
          if (compilation) {
            const module = findModuleById(compilation, id);
            identifier = module.identifier();
            ({ context } = module);
          } else {
            // TODO check if this context is used somewhere
            context = this.rootContext;
          }

          return {
            identifier,
            context,
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
              (key) => `\nexport var ${key} = ${JSON.stringify(locals[key])};`
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
  };

  const publicPath =
    typeof options.publicPath === 'string'
      ? options.publicPath === 'auto'
        ? ''
        : options.publicPath === '' || options.publicPath.endsWith('/')
        ? options.publicPath
        : `${options.publicPath}/`
      : typeof options.publicPath === 'function'
      ? options.publicPath(this.resourcePath, this.rootContext)
      : this._compilation.outputOptions.publicPath === 'auto'
      ? ''
      : this._compilation.outputOptions.publicPath;

  if (optionsFromPlugin.experimentalUseImportModule) {
    if (!this.importModule) {
      callback(
        new Error(
          "You are using experimentalUseImportModule but 'this.importModule' is not available in loader context. You need to have at least webpack 5.33.2."
        )
      );
      return;
    }

    this.importModule(
      `${this.resourcePath}.webpack[javascript/auto]!=!${request}`,
      {
        layer: options.layer,
        publicPath,
      },
      (err, exports) => {
        if (err) {
          callback(err);
          return;
        }

        handleExports(exports);
      }
    );
    return;
  }

  const loaders = this.loaders.slice(this.loaderIndex + 1);

  this.addDependency(this.resourcePath);

  const childFilename = '*';

  const outputOptions = {
    filename: childFilename,
    publicPath,
  };

  const childCompiler = this._compilation.createChildCompiler(
    `${pluginName} ${request}`,
    outputOptions
  );

  // The templates are compiled and executed by NodeJS - similar to server side rendering
  // Unfortunately this causes issues as some loaders require an absolute URL to support ES Modules
  // The following config enables relative URL support for the child compiler
  childCompiler.options.module = { ...childCompiler.options.module };
  childCompiler.options.module.parser = {
    ...childCompiler.options.module.parser,
  };
  childCompiler.options.module.parser.javascript = {
    ...childCompiler.options.module.parser.javascript,
    url: 'relative',
  };

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
    if (error) {
      return callback(error);
    }

    if (compilation.errors.length > 0) {
      return callback(compilation.errors[0]);
    }

    const assets = Object.create(null);
    const assetsInfo = new Map();

    for (const asset of compilation.getAssets()) {
      assets[asset.name] = asset.source;
      assetsInfo.set(asset.name, asset.info);
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

    let originalExports;
    try {
      originalExports = evalModuleCode(this, source, request);
    } catch (e) {
      return callback(e);
    }

    return handleExports(originalExports, compilation, assets, assetsInfo);
  });
}

// eslint-disable-next-line func-names
export default function () {}
