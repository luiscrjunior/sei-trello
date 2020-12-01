module.exports = {
  moduleNameMapper: {
    'view/(.*)': '<rootDir>/src/js/view/$1',
    '\\.(scss|svg)$': 'identity-obj-proxy',
  },
  testMatch: ['**/__tests__/**/*.test.js'],
};
