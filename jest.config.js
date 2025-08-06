module.exports = {
  prettierPath: require.resolve("prettier-2"),
  transformIgnorePatterns: ["/node_modules/", "<rootDir>/dist/"],
  watchPathIgnorePatterns: ["<rootDir>/test/js"],
  setupFilesAfterEnv: ["<rootDir>/setupTest.js"],
};
