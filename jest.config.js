module.exports = {
  projects: [
    {
      displayName: 'Unit and Integration Tests',
      name: 'unit_and_integration',
      moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
          '<rootDir>/src/__tests__/fileMock.js',
        '\\.(scss)$': 'identity-obj-proxy',
        'view/(.*)': '<rootDir>/src/js/view/$1',
        'api/(.*)': '<rootDir>/src/js/api/$1',
        'model/(.*)': '<rootDir>/src/js/model/$1',
      },
      testMatch: ['**/__tests__/**/*.test.js'],
      testPathIgnorePatterns: ['/node_modules/', 'src/__tests__/e2e'],
    },
    {
      displayName: 'E2E Tests',
      name: 'e2e',
      preset: 'jest-puppeteer',
      testMatch: ['**/__tests__/e2e/tests/**/*.test.js'],
      globalSetup: '<rootDir>/src/__tests__/e2e/global-setup.js',
      setupFilesAfterEnv: ['expect-puppeteer'],
    },
  ],
};
