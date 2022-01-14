export const pluginName: "mini-css-extract-plugin";
export const pluginSymbol: unique symbol;
export default MiniCssExtractPlugin;
export type Schema = import("schema-utils/declarations/validate").Schema;
export type Compiler = import("webpack").Compiler;
export type Compilation = import("webpack").Compilation;
declare class MiniCssExtractPlugin {
    static getCssModule(webpack: any): any;
    static getCssDependency(webpack: any): any;
    constructor(options?: {});
    _sortedModulesCache: WeakMap<object, any>;
    options: {
        filename: string;
        ignoreOrder: boolean;
        experimentalUseImportModule: undefined;
        runtime: boolean;
    };
    runtimeOptions: {
        insert: any;
        linkType: any;
        attributes: any;
    };
    /**
     * @param {Compiler} compiler
     */
    apply(compiler: Compiler): void;
    getChunkModules(chunk: any, chunkGraph: any): any;
    sortModules(compilation: any, chunk: any, modules: any, requestShortener: any): any;
    renderContentAsset(compiler: any, compilation: any, chunk: any, modules: any, requestShortener: any, filenameTemplate: any, pathData: any): any;
}
declare namespace MiniCssExtractPlugin {
    const loader: string;
}
