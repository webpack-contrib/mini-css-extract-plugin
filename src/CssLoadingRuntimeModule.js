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
  constructor(runtimeRequirements, runtimeOptions) {
    super('css loading', 10);
    this.runtimeRequirements = runtimeRequirements;
    this.runtimeOptions = runtimeOptions;
  }

  generate() {
    const { chunk, compilation, runtimeRequirements } = this;
    const {
      runtimeTemplate,
      outputOptions: { crossOriginLoading },
    } = compilation;
    const chunkMap = getCssChunkObject(chunk, compilation);

    const withLoading =
      runtimeRequirements.has(RuntimeGlobals.ensureChunkHandlers) &&
      Object.keys(chunkMap).length > 0;
    const withHmr = runtimeRequirements.has(
      RuntimeGlobals.hmrDownloadUpdateHandlers
    );

    if (!withLoading && !withHmr) {
      return null;
    }

    return Template.asString([
      `var createStylesheet = ${runtimeTemplate.basicFunction(
        'chunkId, fullhref, resolve, reject',
        [
          'var linkTag = document.createElement("link");',
          this.runtimeOptions.attributes
            ? Template.asString(
                Object.entries(this.runtimeOptions.attributes).map((entry) => {
                  const [key, value] = entry;

                  return `linkTag.setAttribute(${JSON.stringify(
                    key
                  )}, ${JSON.stringify(value)});`;
                })
              )
            : '',
          'linkTag.rel = "stylesheet";',
          this.runtimeOptions.linkType
            ? `linkTag.type = ${JSON.stringify(this.runtimeOptions.linkType)};`
            : '',
          `var onLinkComplete = ${runtimeTemplate.basicFunction('event', [
            '// avoid mem leaks.',
            'linkTag.onerror = linkTag.onload = null;',
            "if (event.type === 'load') {",
            Template.indent(['resolve();']),
            '} else {',
            Template.indent([
              "var errorType = event && (event.type === 'load' ? 'missing' : event.type);",
              'var realHref = event && event.target && event.target.href || fullhref;',
              'var err = new Error("Loading CSS chunk " + chunkId + " failed.\\n(" + realHref + ")");',
              'err.code = "CSS_CHUNK_LOAD_FAILED";',
              'err.type = errorType;',
              'err.request = realHref;',
              'linkTag.parentNode.removeChild(linkTag)',
              'reject(err);',
            ]),
            '}',
          ])}`,
          'linkTag.onerror = linkTag.onload = onLinkComplete;',
          'linkTag.href = fullhref;',
          crossOriginLoading
            ? Template.asString([
                `if (linkTag.href.indexOf(window.location.origin + '/') !== 0) {`,
                Template.indent(
                  `linkTag.crossOrigin = ${JSON.stringify(crossOriginLoading)};`
                ),
                '}',
              ])
            : '',
          typeof this.runtimeOptions.insert !== 'undefined'
            ? typeof this.runtimeOptions.insert === 'function'
              ? `(${this.runtimeOptions.insert.toString()})(linkTag)`
              : Template.asString([
                  `var target = document.querySelector("${this.runtimeOptions.insert}");`,
                  `target.parentNode.insertBefore(linkTag, target.nextSibling);`,
                ])
            : Template.asString(['document.head.appendChild(linkTag);']),
          'return linkTag;',
        ]
      )};`,
      `var findStylesheet = ${runtimeTemplate.basicFunction('href, fullhref', [
        'var existingLinkTags = document.getElementsByTagName("link");',
        'for(var i = 0; i < existingLinkTags.length; i++) {',
        Template.indent([
          'var tag = existingLinkTags[i];',
          'var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");',
          'if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return tag;',
        ]),
        '}',
        'var existingStyleTags = document.getElementsByTagName("style");',
        'for(var i = 0; i < existingStyleTags.length; i++) {',
        Template.indent([
          'var tag = existingStyleTags[i];',
          'var dataHref = tag.getAttribute("data-href");',
          'if(dataHref === href || dataHref === fullhref) return tag;',
        ]),
        '}',
      ])};`,
      `var loadStylesheet = ${runtimeTemplate.basicFunction(
        'chunkId',
        `return new Promise(${runtimeTemplate.basicFunction('resolve, reject', [
          `var href = ${RuntimeGlobals.require}.miniCssF(chunkId);`,
          `var fullhref = ${RuntimeGlobals.publicPath} + href;`,
          'if(findStylesheet(href, fullhref)) return resolve();',
          'createStylesheet(chunkId, fullhref, resolve, reject);',
        ])});`
      )}`,
      withLoading
        ? Template.asString([
            '// object to store loaded CSS chunks',
            'var installedCssChunks = {',
            Template.indent(
              chunk.ids.map((id) => `${JSON.stringify(id)}: 0`).join(',\n')
            ),
            '};',
            '',
            `${
              RuntimeGlobals.ensureChunkHandlers
            }.miniCss = ${runtimeTemplate.basicFunction('chunkId, promises', [
              `var cssChunks = ${JSON.stringify(chunkMap)};`,
              'if(installedCssChunks[chunkId]) promises.push(installedCssChunks[chunkId]);',
              'else if(installedCssChunks[chunkId] !== 0 && cssChunks[chunkId]) {',
              Template.indent([
                `promises.push(installedCssChunks[chunkId] = loadStylesheet(chunkId).then(${runtimeTemplate.basicFunction(
                  '',
                  'installedCssChunks[chunkId] = 0;'
                )}, ${runtimeTemplate.basicFunction('e', [
                  'delete installedCssChunks[chunkId];',
                  'throw e;',
                ])}));`,
              ]),
              '}',
            ])};`,
          ])
        : '// no chunk loading',
      '',
      withHmr
        ? Template.asString([
            'var oldTags = [];',
            'var newTags = [];',
            `var applyHandler = ${runtimeTemplate.basicFunction('options', [
              `return { dispose: ${runtimeTemplate.basicFunction('', [
                'for(var i = 0; i < oldTags.length; i++) {',
                Template.indent([
                  'var oldTag = oldTags[i];',
                  'if(oldTag.parentNode) oldTag.parentNode.removeChild(oldTag);',
                ]),
                '}',
                'oldTags.length = 0;',
              ])}, apply: ${runtimeTemplate.basicFunction('', [
                'for(var i = 0; i < newTags.length; i++) newTags[i].rel = "stylesheet";',
                'newTags.length = 0;',
              ])} };`,
            ])}`,
            `${
              RuntimeGlobals.hmrDownloadUpdateHandlers
            }.miniCss = ${runtimeTemplate.basicFunction(
              'chunkIds, removedChunks, removedModules, promises, applyHandlers, updatedModulesList',
              [
                'applyHandlers.push(applyHandler);',
                `chunkIds.forEach(${runtimeTemplate.basicFunction('chunkId', [
                  `var href = ${RuntimeGlobals.require}.miniCssF(chunkId);`,
                  `var fullhref = ${RuntimeGlobals.publicPath} + href;`,
                  'const oldTag = findStylesheet(href, fullhref);',
                  'if(!oldTag) return;',
                  `promises.push(new Promise(${runtimeTemplate.basicFunction(
                    'resolve, reject',
                    [
                      `var tag = createStylesheet(chunkId, fullhref, ${runtimeTemplate.basicFunction(
                        '',
                        [
                          'tag.as = "style";',
                          'tag.rel = "preload";',
                          'resolve();',
                        ]
                      )}, reject);`,
                      'oldTags.push(oldTag);',
                      'newTags.push(tag);',
                    ]
                  )}));`,
                ])});`,
              ]
            )}`,
          ])
        : '// no hmr',
    ]);
  }
};
