import { RuntimeGlobals, RuntimeModule, Template, util } from 'webpack';

import { MODULE_TYPE } from './utils';

const {
  comparators: { compareModulesByIdentifier },
} = util;

const getCssChunkObject = (mainChunk, compilation) => {
  const obj = {};
  const { chunkGraph } = compilation;

  for (const chunk of mainChunk.getAllAsyncChunks()) {
    const modules = chunkGraph.getOrderedChunkModulesIterable(
      chunk,
      compareModulesByIdentifier
    );
    for (const module of modules) {
      if (module.type === MODULE_TYPE) {
        obj[chunk.id] = 1;
        break;
      }
    }
  }

  return obj;
};

module.exports = class CssLoadingRuntimeModule extends RuntimeModule {
  constructor(runtimeRequirements) {
    super('css loading', 10);
    this.runtimeRequirements = runtimeRequirements;
  }

  generate() {
    const { chunk, compilation, runtimeRequirements } = this;
    const {
      runtimeTemplate,
      outputOptions: { crossOriginLoading },
    } = compilation;
    const chunkMap = getCssChunkObject(chunk, compilation);

    if (Object.keys(chunkMap).length === 0) return null;

    const withLoading = runtimeRequirements.has(
      RuntimeGlobals.ensureChunkHandlers
    );

    return Template.asString([
      '// object to store loaded CSS chunks',
      'var installedCssChunks = {',
      Template.indent(
        chunk.ids.map((id) => `${JSON.stringify(id)}: 0`).join(',\n')
      ),
      '};',
      '',
      withLoading
        ? Template.asString([
            `${
              RuntimeGlobals.ensureChunkHandlers
            }.miniCss = ${runtimeTemplate.basicFunction('chunkId, promises', [
              `var cssChunks = ${JSON.stringify(chunkMap)};`,
              'if(installedCssChunks[chunkId]) promises.push(installedCssChunks[chunkId]);',
              'else if(installedCssChunks[chunkId] !== 0 && cssChunks[chunkId]) {',
              Template.indent([
                'promises.push(installedCssChunks[chunkId] = new Promise(function(resolve, reject) {',
                Template.indent([
                  `var href = ${RuntimeGlobals.require}.miniCssF(chunkId);`,
                  `var fullhref = ${RuntimeGlobals.publicPath} + href;`,
                  'var existingLinkTags = document.getElementsByTagName("link");',
                  'for(var i = 0; i < existingLinkTags.length; i++) {',
                  Template.indent([
                    'var tag = existingLinkTags[i];',
                    'var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");',
                    'if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return resolve();',
                  ]),
                  '}',
                  'var existingStyleTags = document.getElementsByTagName("style");',
                  'for(var i = 0; i < existingStyleTags.length; i++) {',
                  Template.indent([
                    'var tag = existingStyleTags[i];',
                    'var dataHref = tag.getAttribute("data-href");',
                    'if(dataHref === href || dataHref === fullhref) return resolve();',
                  ]),
                  '}',
                  'var linkTag = document.createElement("link");',
                  'linkTag.rel = "stylesheet";',
                  'linkTag.type = "text/css";',
                  'linkTag.onload = resolve;',
                  'linkTag.onerror = function(event) {',
                  Template.indent([
                    'var request = event && event.target && event.target.src || fullhref;',
                    'var err = new Error("Loading CSS chunk " + chunkId + " failed.\\n(" + request + ")");',
                    'err.code = "CSS_CHUNK_LOAD_FAILED";',
                    'err.request = request;',
                    'delete installedCssChunks[chunkId]',
                    'linkTag.parentNode.removeChild(linkTag)',
                    'reject(err);',
                  ]),
                  '};',
                  'linkTag.href = fullhref;',
                  crossOriginLoading
                    ? Template.asString([
                        `if (linkTag.href.indexOf(window.location.origin + '/') !== 0) {`,
                        Template.indent(
                          `linkTag.crossOrigin = ${JSON.stringify(
                            crossOriginLoading
                          )};`
                        ),
                        '}',
                      ])
                    : '',
                  'var head = document.getElementsByTagName("head")[0];',
                  'head.appendChild(linkTag);',
                ]),
                '}).then(function() {',
                Template.indent(['installedCssChunks[chunkId] = 0;']),
                '}));',
              ]),
              '}',
            ])};`,
          ])
        : '// no chunk loading',
    ]);
  }
};
