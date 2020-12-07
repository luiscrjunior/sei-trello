module.exports = {
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__tests__/fileMock.js',
    '\\.(scss)$': 'identity-obj-proxy',
    'view/(.*)': '<rootDir>/src/js/view/$1',
    'api/(.*)': '<rootDir>/src/js/api/$1',
    'model/(.*)': '<rootDir>/src/js/model/$1',
  },
  testMatch: ['**/__tests__/**/*.test.js'],
};
