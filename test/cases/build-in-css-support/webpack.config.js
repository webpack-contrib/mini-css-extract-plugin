import Self from "../../../src";

module.exports = {
  entry: "./index.js",
  output: {
    clean: false,
    cssFilename: "[name].css",
  },
  experiments: {
    css: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [Self.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new Self({
      filename: "[name].extract.css",
    }),
  ],
};
