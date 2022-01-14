/** @typedef {import("schema-utils/declarations/validate").Schema} Schema */
/** @typedef {import("webpack").Compiler} Compiler */
/** @typedef {import("webpack").Compilation} Compilation */
/** @typedef {import("webpack").ChunkGraph} ChunkGraph */
/** @typedef {import("webpack").Chunk} Chunk */
/** @typedef {import("webpack").Module} Module */
/** @typedef {import("webpack").sources.Source} Source */
/** @typedef {import("webpack").Configuration} Configuration */
/** @typedef {import("webpack").WebpackError} WebpackError */
/**
 * @typedef {Object} LoaderOptions
 * @property {string | ((resourcePath: string, rootContext: string) => string)} [publicPath]
 * @property {boolean} [emit]
 * @property {boolean} [esModule]
 * @property {string} [layer]
 */
/**
 * @typedef {Object} PluginOptions
 * @property {Required<Configuration>['output']['filename']} [filename]
 * @property {Required<Configuration>['output']['chunkFilename']} [chunkFilename]
 * @property {boolean} [ignoreOrder]
 * @property {string | ((linkTag: any) => void)} [insert]
 * @property {Record<string, string>} [attributes]
 * @property {string | false | 'text/css'} [linkType]
 * @property {boolean} [runtime]
 * @property {boolean} [experimentalUseImportModule]
 */
/**
 * @typedef {Object} NormalizedPluginOptions
 * @property {Required<Configuration>['output']['filename']} filename
 * @property {Required<Configuration>['output']['chunkFilename']} [chunkFilename]
 * @property {boolean} ignoreOrder
 * @property {string | ((linkTag: any) => void)} [insert]
 * @property {Record<string, string>} [attributes]
 * @property {string | false | 'text/css'} [linkType]
 * @property {boolean} runtime
 * @property {boolean} [experimentalUseImportModule]
 */
/**
 * @typedef {Object} RuntimeOptions
 * @property {string | ((linkTag: any) => void) | undefined} insert
 * @property {string | false | 'text/css'} linkType
 * @property {Record<string, string> | undefined} attributes
 */
/** @typedef {any} TODO */
export const pluginName: "mini-css-extract-plugin";
export const pluginSymbol: unique symbol;
export default MiniCssExtractPlugin;
export type Schema = import("schema-utils/declarations/validate").Schema;
export type Compiler = import("webpack").Compiler;
export type Compilation = import("webpack").Compilation;
export type ChunkGraph = import("webpack").ChunkGraph;
export type Chunk = import("webpack").Chunk;
export type Module = import("webpack").Module;
export type Source = import("webpack").sources.Source;
export type Configuration = import("webpack").Configuration;
export type WebpackError = import("webpack").WebpackError;
export type LoaderOptions = {
  publicPath?:
    | string
    | ((resourcePath: string, rootContext: string) => string)
    | undefined;
  emit?: boolean | undefined;
  esModule?: boolean | undefined;
  layer?: string | undefined;
};
export type PluginOptions = {
  filename?: Required<Configuration>["output"]["filename"];
  chunkFilename?: Required<Configuration>["output"]["chunkFilename"];
  ignoreOrder?: boolean | undefined;
  insert?: string | ((linkTag: any) => void) | undefined;
  attributes?: Record<string, string> | undefined;
  linkType?: string | false | undefined;
  runtime?: boolean | undefined;
  experimentalUseImportModule?: boolean | undefined;
};
export type NormalizedPluginOptions = {
  filename: Required<Configuration>["output"]["filename"];
  chunkFilename?: Required<Configuration>["output"]["chunkFilename"];
  ignoreOrder: boolean;
  insert?: string | ((linkTag: any) => void) | undefined;
  attributes?: Record<string, string> | undefined;
  linkType?: string | false | undefined;
  runtime: boolean;
  experimentalUseImportModule?: boolean | undefined;
};
export type RuntimeOptions = {
  insert: string | ((linkTag: any) => void) | undefined;
  linkType: string | false | "text/css";
  attributes: Record<string, string> | undefined;
};
export type TODO = any;
declare class MiniCssExtractPlugin {
  /**
   * @private
   * @param {Compiler["webpack"]} webpack
   * @returns {CssModule}
   */
  private static getCssModule;
  /**
   * @private
   * @param {Compiler["webpack"]} webpack
   * @returns {CssDependency}
   */
  private static getCssDependency;
  /**
   * @param {PluginOptions} [options]
   */
  constructor(options?: PluginOptions | undefined);
  _sortedModulesCache: WeakMap<object, any>;
  /**
   * @private
   * @type {NormalizedPluginOptions}
   */
  private options;
  /**
   * @private
   * @type {RuntimeOptions}
   */
  private runtimeOptions;
  /**
   * @param {Compiler} compiler
   */
  apply(compiler: Compiler): void;
  /**
   * @private
   * @param {Chunk} chunk
   * @param {ChunkGraph} chunkGraph
   * @returns {Iterable<Module>}
   */
  private getChunkModules;
  /**
   * @private
   * @param {Compilation} compilation
   * @param {Chunk} chunk
   * @param {Iterable<Module>} modules
   * @param {Compilation["requestShortener"]} requestShortener
   * @returns {Set<TODO>}
   */
  private sortModules;
  /**
   * @private
   * @param {Compiler} compiler
   * @param {Compilation} compilation
   * @param {Chunk} chunk
   * @param {Iterable<Module>} modules
   * @param {Compiler["requestShortener"]} requestShortener
   * @param {string} filenameTemplate
   * @param {TODO} pathData
   * @returns {Source}
   */
  private renderContentAsset;
}
declare namespace MiniCssExtractPlugin {
  const loader: string;
}
