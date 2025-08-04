/* eslint-env browser */
import path from "path";

import { Template } from "webpack";

import MiniCssExtractPlugin from "../src";

import { compile, getCompiler, runInJsDom } from "./helpers/index";

describe("hooks", () => {
  it("beforeTagInsert", async () => {
    const webpackCompiler = getCompiler(
      "insert.js",
      {},
      {
        mode: "none",
        output: {
          publicPath: "",
          path: path.resolve(__dirname, "../outputs"),
          filename: "[name].bundle.js",
        },
        plugins: [
          new MiniCssExtractPlugin({
            filename: "[name].css",
          }),
          {
            /**
             * @param {import('webpack').Compiler} compiler compiler
             */
            apply: (compiler) => {
              compiler.hooks.compilation.tap("sri", (compilation) => {
                MiniCssExtractPlugin.getCompilationHooks(
                  compilation,
                ).beforeTagInsert.tap("sri", (source, varNames) =>
                  Template.asString([
                    source,
                    `${varNames.tag}.setAttribute("integrity", "sriHashes[${varNames.chunkId}]");`,
                  ]),
                );
              });
            },
          },
          {
            /**
             * @param {import('webpack').Compiler} compiler compiler
             */
            apply: (compiler) => {
              compiler.hooks.compilation.tap("href", (compilation) => {
                MiniCssExtractPlugin.getCompilationHooks(
                  compilation,
                ).beforeTagInsert.tap("changeHref", (source, varNames) =>
                  Template.asString([
                    source,
                    `${varNames.tag}.setAttribute("href", "https://github.com/webpack-contrib/mini-css-extract-plugin");`,
                  ]),
                );
              });
            },
          },
        ],
      },
    );
    const stats = await compile(webpackCompiler);
    runInJsDom("main.bundle.js", webpackCompiler, stats, (dom) => {
      const [tag] = dom.window.document.head.getElementsByTagName("link");
      expect(tag.getAttribute("integrity")).toBe("sriHashes[chunkId]");
      expect(tag.getAttribute("href")).toBe(
        "https://github.com/webpack-contrib/mini-css-extract-plugin",
      );
    });
  });
});
