import webpack from 'webpack';

const { RuntimeGlobals, RuntimeModule, Template } = webpack;

class CssChunkLoadingRuntimeModule extends RuntimeModule {
  constructor(runtimeRequirements, chunkMap, MODULE_TYPE, pluginName, options) {
    super('css chunk loading', 10);
    this.runtimeRequirements = runtimeRequirements;
    this.chunkMap = chunkMap;
    this.MODULE_TYPE = MODULE_TYPE;
    this.pluginName = pluginName;
    this.options = options;
  }

  generate() {
    const fn = RuntimeGlobals.ensureChunkHandlers;
    const { compilation, chunk } = this;
    const { runtimeTemplate } = compilation;
    const withCompat = this.runtimeRequirements.has(
      RuntimeGlobals.compatGetDefaultExport
    );

    const chunkMaps = chunk.getChunkMaps();
    const { crossOriginLoading } = compilation.outputOptions;
    const linkHrefPath = compilation.getAssetPath(
      JSON.stringify(this.options.chunkFilename),
      {
        hash: `" + ${RuntimeGlobals.getFullHash} + "`,
        hashWithLength: () => `" + ${RuntimeGlobals.getFullHash} + "`,
        chunk: {
          id: '" + chunkId + "',
          hash: `" + ${JSON.stringify(chunkMaps.hash)}[chunkId] + "`,
          hashWithLength(length) {
            const shortChunkHashMap = Object.create(null);

            for (const chunkId of Object.keys(chunkMaps.hash)) {
              if (typeof chunkMaps.hash[chunkId] === 'string') {
                shortChunkHashMap[chunkId] = chunkMaps.hash[chunkId].substring(
                  0,
                  length
                );
              }
            }

            return `" + ${JSON.stringify(shortChunkHashMap)}[chunkId] + "`;
          },
          contentHash: {
            [this.MODULE_TYPE]: `" + ${JSON.stringify(
              chunkMaps.contentHash[this.MODULE_TYPE]
            )}[chunkId] + "`,
          },
          contentHashWithLength: {
            [this.MODULE_TYPE]: (length) => {
              const shortContentHashMap = {};
              const contentHash = chunkMaps.contentHash[this.MODULE_TYPE];

              for (const chunkId of Object.keys(contentHash)) {
                if (typeof contentHash[chunkId] === 'string') {
                  shortContentHashMap[chunkId] = contentHash[chunkId].substring(
                    0,
                    length
                  );
                }
              }

              return `" + ${JSON.stringify(shortContentHashMap)}[chunkId] + "`;
            },
          },
          name: `" + (${JSON.stringify(chunkMaps.name)}[chunkId]||chunkId) + "`,
        },
        contentHashType: this.MODULE_TYPE,
      }
    );

    return Template.asString([
      '',
      '// object to store loaded CSS chunks',
      'var installedCssChunks = {',
      Template.indent(
        chunk.ids.map((id) => `${JSON.stringify(id)}: 0`).join(',\n')
      ),
      '}',
      '',
      withCompat
        ? Template.asString([
            `${fn}.n = ${runtimeTemplate.basicFunction(
              'chunkId, promises',
              Template.indent([
                // source,
                `// ${this.pluginName} CSS loading`,
                `var cssChunks = ${JSON.stringify(this.chunkMap)};`,
                'if(installedCssChunks[chunkId]) promises.push(installedCssChunks[chunkId]);',
                'else if(installedCssChunks[chunkId] !== 0 && cssChunks[chunkId]) {',
                Template.indent([
                  'promises.push(installedCssChunks[chunkId] = new Promise(function(resolve, reject) {',
                  Template.indent([
                    `var href = ${linkHrefPath};`,
                    `var fullhref = __webpack_require__.p + href;`,
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
              ])
            )};`,
          ])
        : '',
    ]);
  }
}

module.exports = CssChunkLoadingRuntimeModule;
