module.exports = {
  testURL: 'http://localhost/',
  transformIgnorePatterns: ['/node_modules/', '<rootDir>/dist/'],
  watchPathIgnorePatterns: ['<rootDir>/test/js'],
  setupFilesAfterEnv: ['<rootDir>/setupTest.js'],
};
