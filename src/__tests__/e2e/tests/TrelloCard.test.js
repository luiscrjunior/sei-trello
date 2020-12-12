import 'expect-puppeteer';
import api from './../api';

beforeAll(async () => {
  jest.setTimeout(60000);
  await page.setRequestInterception(true);
  page.on('request', api.handleRequests);
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
});

it('create new card', async () => {
  await expect(page).toClick('div.trello-create-card-button:nth-child(1) > a');

  const anchor = await expect(page).toMatchElement('div.trello-card a', {
    text: '00000.000001/2020-01',
    visible: true,
  });

  const card = await anchor.evaluateHandle((anchor) => anchor.closest('div.trello-card'));

  await expect(card).toMatchElement('p', { text: 'Especificação do processo' });
  const paragraph = await expect(card).toMatchElement('p', { text: 'Clique para editar...' });

  const boardPicker = await expect(card).toMatchElement('div', { text: 'em Quadro 1 / Lista 1' });

  const buttonsWrapper = await card.evaluateHandle((card) =>
    card.querySelector('a[data-tooltip="Abrir no Trello"]').closest('div')
  );

  /* checar se os botões foram renderizados */
  expect(
    await buttonsWrapper.$$eval('a[data-tooltip]', (nodes) => nodes.map((node) => node.getAttribute('data-tooltip')))
  ).toEqual(['Checklist', 'Especificar data de entrega', 'Remover Cartão', 'Atualizar Cartão', 'Abrir no Trello']);

  /* checar se os botões estão invisíveis */
  expect(await buttonsWrapper.evaluate((node) => window.getComputedStyle(node).getPropertyValue('opacity'))).toBe('0');

  /* checar se os dois ícones / carets estão invisíveis */
  expect(
    await boardPicker.$$eval('i.fas.fa-caret-down', (nodes) =>
      nodes.map((node) => window.getComputedStyle(node).getPropertyValue('opacity'))
    )
  ).toEqual(['0', '0']);

  /* mouse sobre o cartão */
  await card.hover();
  await page.waitFor(500);

  /* checar se o parágrafo apareceu */
  const paragraphHeight = await paragraph.evaluate((paragraph) => paragraph.closest('div').clientHeight);
  expect(paragraphHeight).toBe(28);

  /* checar se os dois ícones / carets estão visíveis */
  expect(
    await boardPicker.$$eval('i.fas.fa-caret-down', (nodes) =>
      nodes.map((node) => window.getComputedStyle(node).getPropertyValue('opacity'))
    )
  ).toEqual(['1', '1']);

  /* checar se os botões estão visíveis */
  expect(await buttonsWrapper.evaluate((node) => window.getComputedStyle(node).getPropertyValue('opacity'))).toBe('1');
});
