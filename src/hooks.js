const { SyncWaterfallHook } = require("tapable");

/** @typedef {import("webpack").Compilation} Compilation */
/**
 * @typedef {Object} VarNames
 * @property {string} tag
 * @property {string} chunkId
 * @property {string} href
 * @property {string} resolve
 * @property {string} reject
 */

/**
 * @typedef {Object} MiniCssExtractPluginCompilationHooks
 * @property {import("tapable").SyncWaterfallHook<[string, VarNames], string>} beforeTagInsert
 */

/** @type {WeakMap<Compilation, MiniCssExtractPluginCompilationHooks>} */
const compilationHooksMap = new WeakMap();

/**
 *
 * @param {Compilation} compilation the compilation
 * @returns {MiniCssExtractPluginCompilationHooks} the compilation hooks
 */
exports.getCompilationHooks = function getCompilationHooks(compilation) {
  let hooks = compilationHooksMap.get(compilation);
  if (!hooks) {
    hooks = {
      beforeTagInsert: new SyncWaterfallHook(["source", "varNames"], "string"),
    };
    compilationHooksMap.set(compilation, hooks);
  }
  return hooks;
};
