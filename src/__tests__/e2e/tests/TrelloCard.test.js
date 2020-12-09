import 'expect-puppeteer';
import api from './../api';

beforeAll(async () => {
  await page.setRequestInterception(true);
  page.on('request', api);
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
});

it('empty title', async () => {
  await jestPuppeteer.debug();
  await expect(page.title()).resolves.toMatch('');
});
