module.exports = {
  testEnvironment: 'node',
  transformIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist/',
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/test/js',
  ],
};
