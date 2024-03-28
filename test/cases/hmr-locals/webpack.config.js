import { HotModuleReplacementPlugin } from "webpack";

import Self from "../../../src";

module.exports = {
  entry: "./index.css",
  mode: "development",
  devtool: false,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: Self.loader,
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new Self({
      filename: "[name].css",
    }),
  ],
};
