module.exports = {
  testURL: 'http://localhost/',
  preset: 'jest-puppeteer',
  transformIgnorePatterns: ['/node_modules/', '<rootDir>/dist/'],
  watchPathIgnorePatterns: ['<rootDir>/test/js'],
};
