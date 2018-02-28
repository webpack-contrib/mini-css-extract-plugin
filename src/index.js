import fs from 'fs';
import path from 'path';
import webpack from 'webpack';

const NS = path.dirname(fs.realpathSync(__filename));

class CssDependency {
  constructor({ identifier, content, media, sourceMap }) {
    this.identifier = identifier;
    this.content = content;
    this.media = media;
    this.sourceMap = sourceMap;
  }

  getResourceIdentifier() {
    return `cssmodule${this.identifier}`;
  }
}

class CssDependencyTemplate {
  apply() {}
}

class CssModule extends webpack.Module {
  constructor(dependency) {
    super(NS);
    this._identifier = dependency.identifier;
    this.content = dependency.content;
    this.media = dependency.media;
    this.sourceMap = dependency.sourceMap;
  }

  identifier() {
    return `css-module ${this._identifier}`;
  }
}

class CssModuleFactory {
  create({ dependencies: [dependency] }, callback) {
    callback(null, new CssModule(dependency));
  }
}

class MiniCssExtractPlugin {
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
            module.addDependency(new CssDependency(line));
          }
        };
      });
      compilation.dependencyFactories.set(CssDependency, new CssModuleFactory());
      compilation.dependencyTemplates.set(CssDependency, new CssDependencyTemplate());
      compilation.mainTemplate.hooks.shouldRenderModuleForJavascript.tap('mini-css-extract-plugin', (module) => {
        if (module.type === NS) return false;
        return undefined;
      });
      compilation.chunkTemplate.hooks.shouldRenderModuleForJavascript.tap('mini-css-extract-plugin', (module) => {
        if (module.type === NS) return false;
        return undefined;
      });
      compilation.mainTemplate.hooks.renderManifest.tap('mini-css-extract-plugin', (result, options) => {
        const chunk = options.chunk;
        const renderedContent = Array.from(chunk.modulesIterable, m => module[NS]).filter(Boolean);
        if (renderedContent.length > 0) {
          result.push({
            render: () => this.renderContentAsset(renderedContent),
            filenameTemplate: filename,
            pathOptions: {
              chunk
            },
            identifier: `extract-text-webpack-plugin.${id}.${chunk.id}`
          });
        }
      });
    });
  }
}

MiniCssExtractPlugin.loader = require.resolve('./loader');

module.exports = MiniCssExtractPlugin;
