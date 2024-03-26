import path from "path";

import Self from "../../../src";

const PROJECT_DIR = path.resolve(__dirname, "./project");
const SRC_DIR = path.resolve(PROJECT_DIR, "./src");

module.exports = {
  entry: {
    example: path.resolve(PROJECT_DIR, "./src/example.css"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: Self.loader }, "css-loader"],
      },
      {
        test: /\.(svg|png)$/,
        type: "asset/resource",
        generator: {
          filename: (pathdata) =>
            path.join(
              "../../img/bundle/",
              pathdata.module.resource.replace(SRC_DIR, "")
            ),
        },
      },
    ],
  },
  plugins: [
    new Self({
      filename: "[name].css",
    }),
  ],
};
