import {
  MockedTrelloApi,
  clickTrelloRefreshButton,
  matchTrelloCard,
  clickCardButton,
  matchPanel,
  isCardButtonHighlighted,
} from './utils.js';

import LABEL_COLORS from 'view/components/LabelPanel/colors.js';

beforeEach(async () => {
  MockedTrelloApi.clearCards();
  await clickTrelloRefreshButton();
});

const getCardLabels = async (card) =>
  await card.$$eval('[data-testid="card-labels"] span', (spans) =>
    spans.map((span) => ({
      color: window.rgb2hex(window.getComputedStyle(span).getPropertyValue('background-color')),
      name: span.textContent,
    }))
  );

const getBoardLabels = async (panel) => {
  const list = await expect(panel).toMatchElement('[data-testid="board-labels"]');
  return await list.$$eval('li > a:first-child', (items) =>
    items.map((item) => {
      const name = item.querySelector('p').textContent;
      const bgColor = window.getComputedStyle(item).getPropertyValue('background-color');
      const selected = !!item.querySelector('svg');
      return { name, bgColor: window.rgb2hex(bgColor), selected };
    })
  );
};

const matchNthBoardLabel = async (panel, nth) => {
  const list = await expect(panel).toMatchElement('[data-testid="board-labels"]');
  return (await list.$$('li > a:first-child'))[nth - 1];
};

test('render card with no labels', async () => {
  MockedTrelloApi.addCard({
    id: 'card1',
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
    labels: [],
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');
  expect(await getCardLabels(card)).toEqual([]);
  expect(await isCardButtonHighlighted(card, 'Etiquetas')).toBe(false);
});

test('render card with some labels', async () => {
  MockedTrelloApi.addCard({
    id: 'card1',
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
    labels: [
      { id: 'label1', name: 'urgente', color: 'red' },
      { id: 'label2', name: 'analisar', color: 'green' },
      { id: 'label3', name: 'normal', color: null },
      { id: 'label4', name: '', color: 'yellow' },
    ],
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');
  expect(await getCardLabels(card)).toEqual([
    expect.objectContaining({ name: 'urgente', color: LABEL_COLORS['red'][0] }),
    expect.objectContaining({ name: 'analisar', color: LABEL_COLORS['green'][0] }),
    expect.objectContaining({ name: 'normal', color: LABEL_COLORS['default'][0] }),
    expect.objectContaining({ name: '', color: LABEL_COLORS['yellow'][0] }),
  ]);
  expect(await isCardButtonHighlighted(card, 'Etiquetas')).toBe(true);
});

test('render card with no board labels', async () => {
  MockedTrelloApi.setLabels([]);
  MockedTrelloApi.addCard({
    id: 'card1',
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
    labels: [],
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');
  await clickCardButton(card, 'Etiquetas');
  const panel = await matchPanel(card, 'Etiquetas');
  await expect(panel).toMatch('Não há etiquetas.');
});

test('render card with labels and match with board labels', async () => {
  MockedTrelloApi.setLabels([
    { id: 'label1', name: 'urgente', color: 'red' },
    { id: 'label2', name: 'analisar', color: 'green' },
    { id: 'label3', name: '', color: 'yellow' },
    { id: 'label4', name: '', color: null },
  ]);
  MockedTrelloApi.addCard({
    id: 'card1',
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
    labels: [
      { id: 'label1', name: 'urgente', color: 'red' },
      { id: 'label4', name: '', color: null },
    ],
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');
  await clickCardButton(card, 'Etiquetas');
  const panel = await matchPanel(card, 'Etiquetas');
  expect(await getBoardLabels(panel)).toEqual([
    { name: 'urgente', bgColor: LABEL_COLORS['red'][0], selected: true },
    { name: 'analisar', bgColor: LABEL_COLORS['green'][0], selected: false },
    { name: '', bgColor: LABEL_COLORS['yellow'][0], selected: false },
    { name: '', bgColor: LABEL_COLORS['default'][0], selected: true },
  ]);
});

test('select and unselect label', async () => {
  MockedTrelloApi.setLabels([
    { id: 'label1', name: 'urgente', color: 'red' },
    { id: 'label2', name: 'analisar', color: 'green' },
  ]);
  MockedTrelloApi.addCard({
    id: 'card1',
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
    labels: [{ id: 'label1', name: 'urgente', color: 'red' }],
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');
  await clickCardButton(card, 'Etiquetas');
  const panel = await matchPanel(card, 'Etiquetas');
  expect(await getBoardLabels(panel)).toEqual([
    { name: 'urgente', bgColor: LABEL_COLORS['red'][0], selected: true },
    { name: 'analisar', bgColor: LABEL_COLORS['green'][0], selected: false },
  ]);

  /* desseleciona o primeiro label */
  const firstLabel = await matchNthBoardLabel(panel, 1);
  await firstLabel.click();
  await page.waitForTimeout(500);

  expect(await getBoardLabels(panel)).toEqual([
    expect.objectContaining({ name: 'urgente', selected: false }),
    expect.objectContaining({ name: 'analisar', selected: false }),
  ]);

  /* sseleciona o segundo label */
  const secondLabel = await matchNthBoardLabel(panel, 2);
  await secondLabel.click();
  await page.waitForTimeout(500);

  expect(await getBoardLabels(panel)).toEqual([
    expect.objectContaining({ name: 'urgente', selected: false }),
    expect.objectContaining({ name: 'analisar', selected: true }),
  ]);
});

test('create label', async () => {
  MockedTrelloApi.setLabels([{ id: 'label1', name: 'urgente', color: 'red' }]);
  MockedTrelloApi.addCard({
    id: 'card1',
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
    labels: [],
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');
  await clickCardButton(card, 'Etiquetas');
  const panel = await matchPanel(card, 'Etiquetas');
  expect(await getBoardLabels(panel)).toEqual([{ name: 'urgente', bgColor: LABEL_COLORS['red'][0], selected: false }]);

  await expect(card).toClick('button', { text: 'Criar uma nova etiqueta' });
  await page.waitForTimeout(500);

  await expect(card).toClick('a[data-testid="color-green"]');
  await expect(card).toFill('input', 'analisar');

  await expect(card).toClick('button', { text: 'Criar' });
  await page.waitForTimeout(500);

  expect(await getBoardLabels(panel)).toEqual([
    { name: 'urgente', bgColor: LABEL_COLORS['red'][0], selected: false },
    { name: 'analisar', bgColor: LABEL_COLORS['green'][0], selected: true },
  ]);
});

test('edit label', async () => {
  MockedTrelloApi.setLabels([{ id: 'label1', name: 'urgente', color: 'red' }]);
  MockedTrelloApi.addCard({
    id: 'card1',
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
    labels: [{ id: 'label1', name: 'urgente', color: 'red' }],
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');
  await clickCardButton(card, 'Etiquetas');
  const panel = await matchPanel(card, 'Etiquetas');
  expect(await getBoardLabels(panel)).toEqual([{ name: 'urgente', bgColor: LABEL_COLORS['red'][0], selected: true }]);

  const btnEdit = (await panel.$$('[data-testid="board-labels"] > li > a[title="Editar"]'))[0];
  await btnEdit.click();
  await page.waitForTimeout(500);

  await expect(card).toClick('a[data-testid="color-yellow"]');
  await expect(card).toFill('input', 'outra descrição');

  await expect(card).toClick('button', { text: 'Salvar' });
  await page.waitForTimeout(500);

  expect(await getBoardLabels(panel)).toEqual([
    { name: 'outra descrição', bgColor: LABEL_COLORS['yellow'][0], selected: true },
  ]);
});

test('delete label', async () => {
  MockedTrelloApi.setLabels([{ id: 'label1', name: 'urgente', color: 'red' }]);
  MockedTrelloApi.addCard({
    id: 'card1',
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
    labels: [{ id: 'label1', name: 'urgente', color: 'red' }],
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');
  await clickCardButton(card, 'Etiquetas');
  const panel = await matchPanel(card, 'Etiquetas');
  expect(await getBoardLabels(panel)).toEqual([{ name: 'urgente', bgColor: LABEL_COLORS['red'][0], selected: true }]);

  const btnEdit = (await panel.$$('[data-testid="board-labels"] > li > a[title="Editar"]'))[0];
  await btnEdit.click();
  await page.waitForTimeout(500);

  await expect(card).toClick('button', { text: 'Excluir' });
  await page.waitForTimeout(500);

  expect(await getBoardLabels(panel)).toEqual([]);
});
