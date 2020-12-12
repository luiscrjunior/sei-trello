import { format, formatISO, addDays, subDays } from 'date-fns';
import 'expect-puppeteer';
import api from './../api';

beforeAll(async () => {
  jest.setTimeout(60000);
  await page.setRequestInterception(true);
  page.on('request', api.handleRequests);
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
});

beforeEach(async () => {
  api.clearCards();
  await clickTrelloRefreshButton();
});

const clickTrelloRefreshButton = async () => {
  await page.click('div.trello-refresh-button > a');
  await page.waitForTimeout(500);
};
const clickCardRefreshButton = async (card) => {
  const anchor = await expect(card).toMatchElement('a[data-tooltip="Atualizar Cartão"]');
  await anchor.click();
  await page.waitForTimeout(500);
};

const matchTrelloCard = async (processNumber) => {
  const anchor = await expect(page).toMatchElement('div.trello-card a', {
    text: processNumber,
    visible: true,
  });

  return await anchor.evaluateHandle((anchor) => anchor.closest('div.trello-card'));
};

const matchTrelloCardTitle = async (card, title) => {
  const paragraph = (await card.$$('p'))[0];
  expect(await paragraph.evaluate((node) => node.textContent)).toBe(title);
  return paragraph;
};

const matchTrelloCardDescription = async (card, description) => {
  const paragraph = (await card.$$('p'))[1];
  expect(await paragraph.evaluate((node) => node.textContent)).toBe(description);
  return paragraph;
};

test('render card', async () => {
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

  await matchTrelloCardTitle(card, 'Título do cartão');

  const paragraph = await matchTrelloCardDescription(card, 'Clique para editar...');

  const boardPicker = await expect(card).toMatchElement('div', { text: 'em Quadro 1 / Lista 1' });

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

  /* checar se os dois ícones / carets estão invisíveis */
  expect(
    await boardPicker.$$eval('i.fas.fa-caret-down', (nodes) =>
      nodes.map((node) => window.getComputedStyle(node).getPropertyValue('opacity'))
    )
  ).toEqual(['0', '0']);

  /* mouse sobre o cartão */
  await card.hover();
  await page.waitForTimeout(500);

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

test('render card with due', async () => {
  api.addCard({
    id: 'card1',
    name: 'Cartão sem prazo',
    desc: 'SEI 00000.000001/2020-01',
    due: null,
    dueComplete: false,
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');
  await expect(card).not.toMatchElement('li', { text: 'Hoje' });

  /* cartão com prazo para hoje */
  let dueDate = new Date();
  api.updateCard('card1', { due: formatISO(dueDate), dueComplete: false });
  await clickCardRefreshButton(card);
  await expect(card).toMatchElement('span', { text: `${format(dueDate, 'dd/MM')} hoje` });

  /* cartão com prazo para amanhã */
  dueDate = addDays(new Date(), 1);
  api.updateCard('card1', { due: formatISO(dueDate), dueComplete: false });
  await clickCardRefreshButton(card);
  await expect(card).toMatchElement('span', { text: `${format(dueDate, 'dd/MM')} amanhã` });

  /* cartão com prazo para daqui a 2 dias */
  dueDate = addDays(new Date(), 2);
  api.updateCard('card1', { due: formatISO(dueDate), dueComplete: false });
  await clickCardRefreshButton(card);
  await expect(card).toMatchElement('span', { text: `${format(dueDate, 'dd/MM')} 2 dias` });

  /* cartão com prazo para ontem (atrasado) */
  dueDate = subDays(new Date(), 1);
  api.updateCard('card1', { due: formatISO(dueDate), dueComplete: false });
  await clickCardRefreshButton(card);
  await expect(card).toMatchElement('span', { text: `${format(dueDate, 'dd/MM')} atrasado` });

  /* cartão com prazo para hoje e concluído */
  dueDate = new Date();
  api.updateCard('card1', { due: formatISO(dueDate), dueComplete: true });
  await clickCardRefreshButton(card);
  await expect(card).toMatchElement('span', { text: `${format(dueDate, 'dd/MM')} concluído` });
});
