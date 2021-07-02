/* eslint-env browser */
import path from "path";

import MiniCssExtractPlugin from "../src/cjs";

import { compile, getCompiler } from "./helpers/index";

describe("pathinfo option", () => {
  it(`should insert pathinfo`, async () => {
    const compiler = getCompiler(
      "esm.js",
      {},
      {
        mode: "none",
        output: {
          pathinfo: true,
          path: path.resolve(__dirname, "../outputs"),
        },
        plugins: [
          new MiniCssExtractPlugin({
            filename: "[name].css",
          }),
        ],
      }
    );
    const stats = await compile(compiler);
    const fs = stats.compilation.compiler.outputFileSystem;
    const extractedCss = fs
      .readFileSync(path.resolve(__dirname, "../outputs/main.css"))
      .toString();

    expect(extractedCss).toMatch("./simple.css");
  });
  it(`should not insert pathinfo`, async () => {
    const compiler = getCompiler(
      "esm.js",
      {},
      {
        mode: "none",
        output: {
          path: path.resolve(__dirname, "../outputs"),
        },
        plugins: [
          new MiniCssExtractPlugin({
            filename: "[name].css",
          }),
        ],
      }
    );
    const stats = await compile(compiler);
    const fs = stats.compilation.compiler.outputFileSystem;
    const extractedCss = fs
      .readFileSync(path.resolve(__dirname, "../outputs/main.css"))
      .toString();

    expect(extractedCss).not.toMatch("./simple.css");
  });
});
