import fs from 'fs';
import path from 'path';
import NativeModule from 'module';
import loaderUtils from 'loader-utils';
import NodeTemplatePlugin from 'webpack/lib/node/NodeTemplatePlugin';
import NodeTargetPlugin from 'webpack/lib/node/NodeTargetPlugin';
import LibraryTemplatePlugin from 'webpack/lib/LibraryTemplatePlugin';
import SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin';
import LimitChunkCountPlugin from 'webpack/lib/optimize/LimitChunkCountPlugin';
import styleLoader from 'style-loader';

const NS = path.dirname(fs.realpathSync(__filename));

const exec = (loaderContext, code, filename) => {
  const module = new NativeModule(filename, loaderContext);
  module.paths = NativeModule._nodeModulePaths(loaderContext.context); // eslint-disable-line no-underscore-dangle
  module.filename = filename;
  module._compile(code, filename); // eslint-disable-line no-underscore-dangle
  return module.exports;
};

const findModuleById = (modules, id) => {
  for (const module of modules) {
    if (module.id === id) { return module; }
  }
  return null;
};

export function pitch(request) { // eslint-disable-line consistent-return
  const query = loaderUtils.getOptions(this) || {};

  if (query.hmr !== false) {
    return styleLoader.pitch(request);
  }

  const loaders = this.loaders.slice(this.loaderIndex + 1);
  this.addDependency(this.resourcePath);
  const childFilename = '*'; // eslint-disable-line no-path-concat
  const publicPath = typeof query.publicPath === 'string' ? query.publicPath : this._compilation.outputOptions.publicPath;
  const outputOptions = {
    filename: childFilename,
    publicPath,
  };
  const childCompiler = this._compilation.createChildCompiler(`mini-css-extract-plugin ${request}`, outputOptions);
  new NodeTemplatePlugin(outputOptions).apply(childCompiler);
  new LibraryTemplatePlugin(null, 'commonjs2').apply(childCompiler);
  new NodeTargetPlugin().apply(childCompiler);
  new SingleEntryPlugin(this.context, `!!${request}`, 'mini-css-extract-plugin').apply(childCompiler);
  new LimitChunkCountPlugin({ maxChunks: 1 }).apply(childCompiler);
  // We set loaderContext[NS] = false to indicate we already in
  // a child compiler so we don't spawn another child compilers from there.
  childCompiler.hooks.thisCompilation.tap('mini-css-extract-plugin loader', (compilation) => {
    compilation.hooks.normalModuleLoader.tap('mini-css-extract-plugin loader', (loaderContext, module) => {
      loaderContext[NS] = false; // eslint-disable-line no-param-reassign
      if (module.request === request) {
        module.loaders = loaders.map((loader) => { // eslint-disable-line no-param-reassign
          return ({
            loader: loader.path,
            options: loader.options,
            ident: loader.ident,
          });
        });
      }
    });
  });

  let source;
  childCompiler.hooks.afterCompile.tap('mini-css-extract-plugin', (compilation) => {
    source = compilation.assets[childFilename] && compilation.assets[childFilename].source();

    // Remove all chunk assets
    compilation.chunks.forEach((chunk) => {
      chunk.files.forEach((file) => {
        delete compilation.assets[file]; // eslint-disable-line no-param-reassign
      });
    });
  });

  const callback = this.async();
  childCompiler.runAsChild((err, entries, compilation) => {
    if (err) return callback(err);

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
      this[NS](text);
    } catch (e) {
      return callback(e);
    }
    let resultSource = '// extracted by mini-css-extract-plugin';
    if (locals && typeof resultSource !== 'undefined') {
      resultSource += `\nmodule.exports = ${JSON.stringify(locals)};`;
    }

    return callback(null, resultSource);
  });
}
export default function () {}
