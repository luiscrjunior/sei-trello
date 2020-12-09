const { setup: setupPuppeteer } = require('jest-environment-puppeteer');
const { setup: setupDevServer } = require('jest-dev-server');

module.exports = async function globalSetup(globalConfig) {
  await setupPuppeteer(globalConfig);
  await setupDevServer({
    command: `node src/__tests__/e2e/server.js`,
    launchTimeout: 50000,
    port: 8080,
  });
};
