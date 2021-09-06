import Self from "../../../src";

module.exports = {
  entry: {
    "light-theme": {
      import: ["./src/index.js", "./src/style.scss"],
    },
    "dark-theme": {
      import: ["./src/index.js", "./src/style.scss?dark"],
    },
  },
  // For better runtime code caching
  optimization: {
    runtimeChunk: {
      name: "runtime",
    },
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        oneOf: [
          {
            resourceQuery: "?dark",
            use: [
              Self.loader,
              "css-loader",
              {
                loader: "sass-loader",
                options: {
                  additionalData: `@use 'dark-theme/vars' as vars;`,
                },
              },
            ],
          },
          {
            use: [
              Self.loader,
              "css-loader",
              {
                loader: "sass-loader",
                options: {
                  additionalData: `@use 'light-theme/vars' as vars;`,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new Self({
      filename: "[name].css",
    }),
  ],
};
