import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import sources from 'webpack-sources';

const { RawSource, ConcatSource } = sources;

const NS = path.dirname(fs.realpathSync(__filename));

class CssDependency extends webpack.Dependency {
  constructor({ identifier, content, media, sourceMap }, context) {
    super();
    this.identifier = identifier;
    this.content = content;
    this.media = media;
    this.sourceMap = sourceMap;
    this.context = context;
  }

  getResourceIdentifier() {
    return `css-module-${this.identifier}`;
  }
}

class CssDependencyTemplate {
  apply() {}
}

class CssModule extends webpack.Module {
  constructor(dependency) {
    super(NS, dependency.context);
    this._identifier = dependency.identifier;
    this.content = dependency.content;
    this.media = dependency.media;
    this.sourceMap = dependency.sourceMap;
  }

  source() {
    // TODO add webpack support for omitting js source
    return new RawSource('// extracted by mini-css-extract-plugin');
  }

  size() {
    return 0;
  }

  identifier() {
    return `css ${this._identifier}`;
  }

  readableIdentifier(requestShortener) {
    return `css ${requestShortener.shorten(this._identifier)}`;
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
      // TODO use webpack conversion style here
      this.options.chunkFilename = this.options.filename;
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
          for (const line of content) {
            module.addDependency(new CssDependency(line, m.context));
          }
        };
      });
      compilation.dependencyFactories.set(CssDependency, new CssModuleFactory());
      compilation.dependencyTemplates.set(CssDependency, new CssDependencyTemplate());
      compilation.mainTemplate.hooks.renderManifest.tap('mini-css-extract-plugin', (result, { chunk }) => {
        const renderedModules = Array.from(chunk.modulesIterable).filter(module => module.type === NS);
        if (renderedModules.length > 0) {
          result.push({
            render: () => this.renderContentAsset(renderedModules),
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
            render: () => this.renderContentAsset(renderedModules),
            filenameTemplate: this.options.chunkFilename,
            pathOptions: {
              chunk,
            },
            identifier: `mini-css-extract-plugin.${chunk.id}`,
          });
        }
      });
    });
  }
  renderContentAsset(modules) {
    modules.sort((a, b) => a.index2 - b.index2);
    // TODO put @import on top
    const source = new ConcatSource();
    for (const m of modules) {
      if (m.media) {
        source.add(`@media ${m.media} {\n`);
      }
      source.add(m.content);
      source.add('\n');
      if (m.media) {
        source.add('}\n');
      }
    }
    return source;
  }
}

MiniCssExtractPlugin.loader = require.resolve('./loader');

export default MiniCssExtractPlugin;
