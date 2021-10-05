const yn = require("../helpers/yn");
const Self = require("../../");

const ENABLE_HMR =
  typeof process.env.ENABLE_HMR !== "undefined"
    ? Boolean(process.env.ENABLE_HMR)
    : true;

const ENABLE_ES_MODULE =
  typeof process.env.ES_MODULE !== "undefined"
    ? Boolean(process.env.ES_MODULE)
    : true;

const OLD_API =
  typeof process.env.OLD_API !== "undefined" ? yn(process.env.OLD_API) : true;

console.log(OLD_API);

module.exports = {
  mode: "development",
  output: {
    chunkFilename: "[name].chunk.js",
    publicPath: "/dist/",
    crossOriginLoading: "anonymous",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: [/\.module\.css$/i],
        use: [
          {
            loader: Self.loader,
          },
          {
            loader: "css-loader",
            options: {
              esModule: ENABLE_ES_MODULE,
            },
          },
        ],
      },
      {
        test: /\.module\.css$/i,
        use: [
          {
            loader: Self.loader,
            options: {
              esModule: ENABLE_ES_MODULE,
            },
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              esModule: ENABLE_ES_MODULE,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new Self({
      filename: "[name].css",
      chunkFilename: "[name].chunk.css",
      experimentalUseImportModule: OLD_API,
    }),
  ],
  devServer: {
    hot: ENABLE_HMR,
    static: __dirname,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};
