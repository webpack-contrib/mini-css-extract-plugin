type Module = import("webpack").Module;
type Dependency = import("webpack").Dependency;
type Source = import("webpack").sources.Source;
type AssetInfo = import("webpack").AssetInfo;

export interface CssModule {
  new ({
    context,
    identifier,
    identifierIndex,
    content,
    layer,
    supports,
    media,
    sourceMap,
    assets,
    assetsInfo,
  }: {
    context: string;
    identifier: string;
    identifierIndex: number;
    content: Buffer;
    layer: string | null;
    supports?: string;
    media: string;
    sourceMap?: Buffer;
    assets: { [key: string]: Source };
    assetsInfo: Map<string, AssetInfo>;
  }): Module;
}

interface CssDependencyPublicOptions {
  identifier: string;
  content: Buffer;
  layer?: string;
  supports?: string;
  media: string;
  sourceMap?: Buffer;
}

export interface CssDependency {
  new (
    {
      identifier,
      content,
      layer,
      supports,
      media,
      sourceMap,
    }: CssDependencyPublicOptions,
    context: string | null,
    identifierIndex: number
  ): Dependency & {
    assetsInfo?: Map<string, AssetInfo>;
    assets?: { [key: string]: Source };
  };
}
