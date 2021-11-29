/* eslint-env browser */
import path from "path";

import MiniCssExtractPlugin from "../src/cjs";

import {
  compile,
  getCompiler,
  getErrors,
  getWarnings,
  runInJsDom,
} from "./helpers/index";

describe("public path", () => {
  it("should work with function output.publicPath", async () => {
    const compiler = getCompiler(
      "simple.js",
      {},
      {
        output: {
          publicPath() {
            return "";
          },
          path: path.resolve(__dirname, "../outputs"),
          filename: "[name].bundle.js",
        },
        plugins: [
          new MiniCssExtractPlugin({
            filename: "[name].css",
          }),
        ],
      }
    );
    const stats = await compile(compiler);

    runInJsDom("main.bundle.js", compiler, stats, (dom) => {
      expect(dom.serialize()).toMatchSnapshot("DOM");
    });

    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });
});
