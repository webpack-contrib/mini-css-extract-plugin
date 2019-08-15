import NativeModule from 'module';

import path from 'path';

import loaderUtils from 'loader-utils';
import NodeTemplatePlugin from 'webpack/lib/node/NodeTemplatePlugin';
import NodeTargetPlugin from 'webpack/lib/node/NodeTargetPlugin';
import LibraryTemplatePlugin from 'webpack/lib/LibraryTemplatePlugin';
import SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin';
import LimitChunkCountPlugin from 'webpack/lib/optimize/LimitChunkCountPlugin';
import validateOptions from 'schema-utils';

import schema from './options.json';

const MODULE_TYPE = 'css/mini-extract';
const pluginName = 'mini-css-extract-plugin';

function hotLoader(content, context) {
  const cssReload = loaderUtils.stringifyRequest(
    context.context,
    path.join(__dirname, 'hmr/hotModuleReplacement.js')
  );

  const cssReloadArgs = JSON.stringify({
    ...context.options,
    locals: !!context.locals,
  });

  // The module should *always* self-accept and have an error handler
  // present to ensure a faulting module does not bubble further out.
  // The error handler itself does not actually need to do anything.
  //
  // When there are no locals, then the module should also accept
  // changes on an empty set of dependencies and execute the css
  // reloader.
  let accept = 'module.hot.accept(function(){});';
  if (!context.locals) {
    accept += '\n      module.hot.accept(undefined, cssReload);';
  }

  return `${content}
    if(module.hot) {
      // ${Date.now()}
      var cssReload = require(${cssReload})(module.id, ${cssReloadArgs});
      module.hot.dispose(cssReload);
      ${accept}
    }
  `;
}

function interceptError(callback, interceptor) {
  return (err, source) => {
    return callback(null, err ? interceptor(err) : source);
  };
}

const exec = (loaderContext, code, filename) => {
  const module = new NativeModule(filename, loaderContext);

  module.paths = NativeModule._nodeModulePaths(loaderContext.context); // eslint-disable-line no-underscore-dangle
  module.filename = filename;
  module._compile(code, filename); // eslint-disable-line no-underscore-dangle

  return module.exports;
};

const findModuleById = (modules, id) => {
  for (const module of modules) {
    if (module.id === id) {
      return module;
    }
  }

  return null;
};

export function pitch(request) {
  const options = loaderUtils.getOptions(this) || {};

  validateOptions(schema, options, 'Mini CSS Extract Plugin Loader');

  const loaders = this.loaders.slice(this.loaderIndex + 1);

  this.addDependency(this.resourcePath);

  const childFilename = '*'; // eslint-disable-line no-path-concat
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

  // We set loaderContext[MODULE_TYPE] = false to indicate we already in
  // a child compiler so we don't spawn another child compilers from there.
  childCompiler.hooks.thisCompilation.tap(
    `${pluginName} loader`,
    (compilation) => {
      compilation.hooks.normalModuleLoader.tap(
        `${pluginName} loader`,
        (loaderContext, module) => {
          // eslint-disable-next-line no-param-reassign
          loaderContext.emitFile = this.emitFile;
          loaderContext[MODULE_TYPE] = false; // eslint-disable-line no-param-reassign

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
        }
      );
    }
  );

  let source;

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

  const callback = !options.hmr
    ? this.async()
    : interceptError(this.async(), (err) => {
        let resultSource = `// extracted by ${pluginName}`;
        resultSource += hotLoader('', {
          context: this.context,
          locals: null,
          options,
        });
        resultSource += `\nthrow new Error(${JSON.stringify(String(err))});`;
        return resultSource;
      });

  childCompiler.runAsChild((err, entries, compilation) => {
    if (err) {
      return callback(err);
    }

    compilation.fileDependencies.forEach((dep) => {
      this.addDependency(dep);
    }, this);

    compilation.contextDependencies.forEach((dep) => {
      this.addContextDependency(dep);
    }, this);

    if (compilation.errors.length > 0) {
      return callback(compilation.errors[0]);
    }

    if (!source) {
      return callback(new Error("Didn't get a result from child compiler"));
    }

    let text;
    let locals;

    try {
      text = exec(this, source, request);
      locals = text && text.locals;
      if (!Array.isArray(text)) {
        text = [[null, text]];
      } else {
        text = text.map((line) => {
          const module = findModuleById(compilation.modules, line[0]);

          return {
            identifier: module.identifier(),
            content: line[1],
            media: line[2],
            sourceMap: line[3],
          };
        });
      }
      this[MODULE_TYPE](text);
    } catch (e) {
      return callback(e);
    }

    let resultSource = `// extracted by ${pluginName}`;
    const result = locals
      ? `\nmodule.exports = ${JSON.stringify(locals)};`
      : '';

    resultSource += options.hmr
      ? hotLoader(result, { context: this.context, options, locals })
      : result;

    return callback(null, resultSource);
  });
}

export default function() {}
