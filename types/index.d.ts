export = MiniCssExtractPlugin;
declare class MiniCssExtractPlugin {
    /**
     * @private
     * @param {Compiler["webpack"]} webpack
     * @returns {CssModuleConstructor}
     */
    private static getCssModule;
    /**
     * @param {Compiler["webpack"]} webpack
     * @returns {CssDependencyConstructor}
     */
    static getCssDependency(webpack: Compiler["webpack"]): CssDependencyConstructor;
    /**
     * @param {PluginOptions} [options]
     */
    constructor(options?: PluginOptions | undefined);
    /**
     * @private
     * @type {WeakMap<Chunk, Set<CssModule>>}
     * @private
     */
    private _sortedModulesCache;
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
     * @param {CssModule[]} modules
     * @param {Compilation["requestShortener"]} requestShortener
     * @returns {Set<CssModule>}
     */
    private sortModules;
    /**
     * @private
     * @param {Compiler} compiler
     * @param {Compilation} compilation
     * @param {Chunk} chunk
     * @param {CssModule[]} modules
     * @param {Compiler["requestShortener"]} requestShortener
     * @param {string} filenameTemplate
     * @param {Parameters<Exclude<Required<Configuration>['output']['filename'], string | undefined>>[0]} pathData
     * @returns {Source}
     */
    private renderContentAsset;
}
declare namespace MiniCssExtractPlugin {
    export { pluginName, pluginSymbol, loader, Schema, Compiler, Compilation, ChunkGraph, Chunk, LoaderContext, ChunkGroup, Module, Dependency, Source, Configuration, WebpackError, AssetInfo, LoaderDependency, LoaderOptions, PluginOptions, NormalizedPluginOptions, RuntimeOptions, TODO, CssModule, CssModuleConstructor, CssDependency, CssDependencyConstructor };
}
type Compiler = import("webpack").Compiler;
type CssDependencyConstructor = new (...args: any) => TODO;
type PluginOptions = {
    filename?: Required<Configuration>['output']['filename'];
    chunkFilename?: Required<Configuration>['output']['chunkFilename'];
    ignoreOrder?: boolean | undefined;
    insert?: string | ((linkTag: any) => void) | undefined;
    attributes?: Record<string, string> | undefined;
    linkType?: string | false | undefined;
    runtime?: boolean | undefined;
    experimentalUseImportModule?: boolean | undefined;
};
/** @typedef {import("schema-utils/declarations/validate").Schema} Schema */
/** @typedef {import("webpack").Compiler} Compiler */
/** @typedef {import("webpack").Compilation} Compilation */
/** @typedef {import("webpack").ChunkGraph} ChunkGraph */
/** @typedef {import("webpack").Chunk} Chunk */
/** @typedef {import("webpack").LoaderContext<any>} LoaderContext */
/** @typedef {Parameters<import("webpack").Chunk["isInGroup"]>[0]} ChunkGroup */
/** @typedef {import("webpack").Module} Module */
/** @typedef {import("webpack").Dependency} Dependency */
/** @typedef {import("webpack").sources.Source} Source */
/** @typedef {import("webpack").Configuration} Configuration */
/** @typedef {import("webpack").WebpackError} WebpackError */
/** @typedef {import("webpack").AssetInfo} AssetInfo */
/** @typedef {import("./loader.js").Dependency} LoaderDependency */
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
declare const pluginName: "mini-css-extract-plugin";
declare const pluginSymbol: unique symbol;
declare var loader: string;
type Schema = import("schema-utils/declarations/validate").Schema;
type Compilation = import("webpack").Compilation;
type ChunkGraph = import("webpack").ChunkGraph;
type Chunk = import("webpack").Chunk;
type LoaderContext = import("webpack").LoaderContext<any>;
type ChunkGroup = Parameters<import("webpack").Chunk["isInGroup"]>[0];
type Module = import("webpack").Module;
type Dependency = import("webpack").Dependency;
type Source = import("webpack").sources.Source;
type Configuration = import("webpack").Configuration;
type WebpackError = import("webpack").WebpackError;
type AssetInfo = import("webpack").AssetInfo;
type LoaderDependency = import("./loader.js").Dependency;
type LoaderOptions = {
    publicPath?: string | ((resourcePath: string, rootContext: string) => string) | undefined;
    emit?: boolean | undefined;
    esModule?: boolean | undefined;
    layer?: string | undefined;
};
type NormalizedPluginOptions = {
    filename: Required<Configuration>['output']['filename'];
    chunkFilename?: Required<Configuration>['output']['chunkFilename'];
    ignoreOrder: boolean;
    insert?: string | ((linkTag: any) => void) | undefined;
    attributes?: Record<string, string> | undefined;
    linkType?: string | false | undefined;
    runtime: boolean;
    experimentalUseImportModule?: boolean | undefined;
};
type RuntimeOptions = {
    insert: string | ((linkTag: any) => void) | undefined;
    linkType: string | false | 'text/css';
    attributes: Record<string, string> | undefined;
};
type TODO = any;
type CssModule = Module & {
    content: Buffer;
    media?: string;
    sourceMap?: Buffer;
    supports?: string;
    layer?: string;
};
type CssModuleConstructor = new (...args: any) => TODO;
type CssDependency = import("webpack").Dependency & {
    context: string | undefined;
    identifier: string;
    identifierIndex: number;
    content: Buffer;
    sourceMap?: Buffer | undefined;
    media?: string | undefined;
    supports?: string | undefined;
    layer?: string | undefined;
    assetsInfo?: Map<string, import("webpack").AssetInfo> | undefined;
    assets?: {
        [key: string]: any;
    } | undefined;
};
