import path from "path";

import Self from "../../../src";

module.exports = {
  entry: "./index.js",
  context: path.resolve(__dirname, "app"),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [Self.loader, "./mockLoader"],
      },
    ],
  },
  plugins: [
    new Self({
      filename: "[name].css",
    }),
  ],
};
