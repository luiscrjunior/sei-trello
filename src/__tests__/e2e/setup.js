beforeAll(async () => {
  jest.setTimeout(60000);
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.addScriptTag({ path: './src/__tests__/e2e/script.js' });
});
