module.exports = {
  moduleNameMapper: {
    'view/(.*)': '<rootDir>/src/js/view/$1',
    '\\.(scss)$': 'identity-obj-proxy',
  },
  testMatch: ['**/__tests__/**/*.test.js'],
};
