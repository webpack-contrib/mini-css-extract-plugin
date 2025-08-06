import { defineConfig, globalIgnores } from "eslint/config";
import configs from "eslint-config-webpack/configs.js";

export default defineConfig([
  globalIgnores([
    "test/**/cases/**/*",
    "test/manual/**/*",
    "!test/cases/webpack.config.js",
    "test/js/**/*",
  ]),
  {
    extends: [configs["recommended-dirty"]],
  },
]);
