import api from './../api';

import {
  setupBeforeAll,
  clickTrelloRefreshButton,
  clickCardButton,
  matchTrelloCard,
  matchTrelloCardTitle,
  matchTrelloCardDescription,
  matchPanel,
  getCSSProperty,
} from './utils.js';

setupBeforeAll(api);

beforeEach(async () => {
  api.clearCards();
  await clickTrelloRefreshButton();
});

test('render card', async () => {
  api.addCard({
    id: 'card1',
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
    board: {
      id: 'board1',
      name: 'Quadro 1',
    },
    list: {
      id: 'list1',
      name: 'Lista 1',
    },
  });

  await clickTrelloRefreshButton();

  const card = await matchTrelloCard('00000.000001/2020-01');

  await matchTrelloCardTitle(card, 'Título do cartão');

  const paragraph = await matchTrelloCardDescription(card, 'Clique para editar...');

  await expect(card).toMatchElement('div', { text: 'em Quadro 1 / Lista 1' });

  const buttonsWrapper = await card.evaluateHandle((card) =>
    card.querySelector('a[data-tooltip="Abrir no Trello"]').closest('div')
  );

  /* borda padrão */
  expect(await card.evaluate((card) => window.getComputedStyle(card.firstChild).getPropertyValue('border-color'))).toBe(
    'rgb(170, 170, 170)'
  );

  /* checar se os botões foram renderizados */
  expect(
    await buttonsWrapper.$$eval('a[data-tooltip]', (nodes) => nodes.map((node) => node.getAttribute('data-tooltip')))
  ).toEqual(['Checklist', 'Especificar data de entrega', 'Remover Cartão', 'Atualizar Cartão', 'Abrir no Trello']);

  /* checar se os botões estão invisíveis */
  expect(await buttonsWrapper.evaluate((node) => window.getComputedStyle(node).getPropertyValue('opacity'))).toBe('0');

  /* mouse sobre o cartão */
  await card.hover();
  await page.waitForTimeout(500);

  /* checar se o parágrafo apareceu */
  const paragraphHeight = await paragraph.evaluate((paragraph) => paragraph.closest('div').clientHeight);
  expect(paragraphHeight).toBe(28);

  /* checar se os botões estão visíveis */
  expect(await buttonsWrapper.evaluate((node) => window.getComputedStyle(node).getPropertyValue('opacity'))).toBe('1');

  /* checar o link do botão Abrir no Trello */
  expect(
    await card.evaluate((card) => card.querySelector('a[data-tooltip="Abrir no Trello"]').getAttribute('href'))
  ).toBe('https://trello.com/c/card1');
});

test('render card with process not visualized', async () => {
  api.addCard({
    name: 'Processo não visualizado',
    desc: 'SEI 00000.000002/2020-02',
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000002/2020-02');
  await matchTrelloCardTitle(card, 'Processo não visualizado');

  /* borda vermelha */
  expect(await card.evaluate((card) => window.getComputedStyle(card.firstChild).getPropertyValue('border-color'))).toBe(
    'rgb(255, 0, 0)'
  );
});

test('render card with description', async () => {
  api.addCard({
    name: 'Cartão com descrição',
    desc: 'SEI 00000.000001/2020-01\nEsta é a descrição do cartão.',
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');
  await matchTrelloCardTitle(card, 'Cartão com descrição');
  await matchTrelloCardDescription(card, 'Esta é a descrição do cartão.');
});

test('open and close panels', async () => {
  api.addCard({
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');

  const panels = [
    { title: 'Data de entrega', button: 'Especificar data de entrega' },
    { title: 'Checklist', button: 'Checklist' },
  ];

  for await (let panel of panels) {
    /*painel fechado inicialmente */
    await expect(matchPanel(card, panel.title)).rejects.toThrow();

    /* clicar no botão para abrir o painel */
    await clickCardButton(card, panel.button);

    /* checar se painel abriu */
    await matchPanel(card, panel.title);

    /* checar se painel fechou quando o mouse se moveu para fora do cartão */
    await page.hover('div.trello-refresh-button');
    await expect(matchPanel(card, panel.title)).rejects.toThrow();

    /* abre novamente e clica no X para fechar */
    await clickCardButton(card, panel.button);
    await expect(await matchPanel(card, panel.title)).toClick('a', { text: '×' });
    await expect(matchPanel(card, panel.title)).rejects.toThrow();
  }
});

test('board and list panels', async () => {
  api.setBoards([
    {
      id: 'board1',
      name: 'Quadro 1',
    },
    {
      id: 'board2',
      name: 'Quadro 2',
    },
  ]);
  api.setLists([
    {
      id: 'list1',
      name: 'Lista 1',
    },
    {
      id: 'list2',
      name: 'Lista 2',
    },
  ]);
  api.addCard({
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
    board: {
      id: 'board1',
      name: 'Quadro 1',
    },
    list: {
      id: 'list1',
      name: 'Lista 1',
    },
  });
  await clickTrelloRefreshButton();

  const card = await matchTrelloCard('00000.000001/2020-01');

  const boardPicker = await expect(card).toMatchElement('div', { text: 'em Quadro 1 / Lista 1' });

  const picker1 = (await boardPicker.$$('i.fas.fa-caret-down'))[0];
  const picker2 = (await boardPicker.$$('i.fas.fa-caret-down'))[1];
  const menu1 = (await boardPicker.$$('ul'))[0];
  const menu2 = (await boardPicker.$$('ul'))[1];

  /* checar se os dois ícones / carets estão invisíveis bem como os menus */
  expect(await getCSSProperty(picker1, 'opacity')).toBe('0');
  expect(await getCSSProperty(picker2, 'opacity')).toBe('0');
  expect(await getCSSProperty(menu1, 'display')).toBe('none');
  expect(await getCSSProperty(menu2, 'display')).toBe('none');

  /* mouse sobre o cartão */
  await card.hover();
  await page.waitForTimeout(500);

  /* o primeiro caret deve aparecer */
  expect(await getCSSProperty(picker1, 'opacity')).toBe('1');

  /* clica no picker do quadro */
  await picker1.click();
  await page.waitForTimeout(500);
  expect(await getCSSProperty(menu1, 'display')).toBe('block');
  expect(await menu1.$$eval('li > a', (anchors) => anchors.map((anchor) => anchor.textContent))).toEqual([
    'Quadro 1',
    'Quadro 2',
  ]);
  await page.hover('div.trello-refresh-button'); /* afasta o mouse pra longe */
  await page.waitForTimeout(500);
  expect(await getCSSProperty(menu1, 'display')).toBe('none');
  expect(await getCSSProperty(picker1, 'opacity')).toBe('0');

  /* mouse sobre o cartão */
  await card.hover();
  await page.waitForTimeout(500);

  /* o segundo caret deve aparecer */
  expect(await getCSSProperty(picker2, 'opacity')).toBe('1');

  /* clica no picker da lista */
  await picker2.click();
  await page.waitForTimeout(500);
  expect(await getCSSProperty(menu2, 'display')).toBe('block');
  expect(await menu2.$$eval('li > a', (anchors) => anchors.map((anchor) => anchor.textContent))).toEqual([
    'Lista 1',
    'Lista 2',
  ]);
  await page.hover('div.trello-refresh-button'); /* afasta o mouse pra longe */
  await page.waitForTimeout(500);
  expect(await getCSSProperty(menu2, 'display')).toBe('none');
  expect(await getCSSProperty(picker2, 'opacity')).toBe('0');
});

test('delete card', async () => {
  api.addCard({
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');

  await clickCardButton(card, 'Remover Cartão');
  await expect(page).toClick('button', { text: 'Sim, remover!', visible: true });
  await page.waitForTimeout(500);
  await expect(matchTrelloCard('00000.000001/2020-01')).rejects.toThrow();
});

test('update card button', async () => {
  api.addCard({
    id: 'card1',
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');

  await matchTrelloCardTitle(card, 'Título do cartão');
  await matchTrelloCardDescription(card, 'Clique para editar...');
  await expect(card).toMatchElement('div', { text: 'em Quadro 1 / Lista 1' });

  api.updateCard('card1', {
    name: 'Outro título do cartão',
    desc: 'SEI 00000.000001/2020-01\nMinha descrição',
    board: {
      id: 'board2',
      name: 'Quadro 2',
    },
    list: {
      id: 'list2',
      name: 'Lista 2',
    },
  });
  await clickCardButton(card, 'Atualizar Cartão');
  await page.waitForTimeout(500);

  await matchTrelloCardTitle(card, 'Outro título do cartão');
  await matchTrelloCardDescription(card, 'Minha descrição');
  await expect(card).toMatchElement('div', { text: 'em Quadro 2 / Lista 2' });
});

test('duplicated process warning', async () => {
  api.addCard({
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
  });
  api.addCard({
    name: 'Outro título do cartão',
    desc: 'SEI 00000.000001/2020-01',
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');

  await expect(card).toMatchElement('i[data-tooltip="Processo com mais de um cartão. Mostrando o primeiro."]', {
    visible: true,
  });
});
