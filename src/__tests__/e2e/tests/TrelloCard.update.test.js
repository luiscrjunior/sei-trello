import {
  MockedTrelloApi,
  setupBeforeAll,
  clickTrelloRefreshButton,
  matchTrelloCard,
  matchTrelloCardTitle,
  matchTrelloCardDescription,
} from './utils.js';

setupBeforeAll();

beforeEach(async () => {
  MockedTrelloApi.clearCards();
  await clickTrelloRefreshButton();
});

test('update card title and description', async () => {
  MockedTrelloApi.addCard({
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');

  const title = await matchTrelloCardTitle(card, 'Título do cartão');
  await title.click();

  const editableTitle = await expect(page).toMatchElement('textarea', { text: 'Título do cartão', visible: true });

  await editableTitle.evaluate(() => document.execCommand('selectall', false, null));
  await editableTitle.type('Outro título');
  await editableTitle.press('Enter');
  await page.waitForTimeout(500);

  await matchTrelloCardTitle(card, 'Outro título');

  const description = await matchTrelloCardDescription(card, 'Clique para editar...');
  await description.click();
  const editableDescription = await expect(page).toMatchElement('textarea', { text: '', visible: true });
  await editableDescription.type('Descrição do cartão');
  await editableDescription.press('Enter');
  await page.waitForTimeout(500);
  await matchTrelloCardDescription(card, 'Descrição do cartão');
});

test('update board and list', async () => {
  MockedTrelloApi.setBoards([
    {
      id: 'board1',
      name: 'Quadro 1',
    },
    {
      id: 'board2',
      name: 'Quadro 2',
    },
  ]);
  MockedTrelloApi.setLists([
    {
      id: 'list1',
      name: 'Lista 1',
    },
    {
      id: 'list2',
      name: 'Lista 2',
    },
  ]);
  MockedTrelloApi.addCard({
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

  const boardPicker = await expect(card).toMatchElement('div[data-testid="card-location"]', {
    text: 'em Quadro 1 / Lista 1',
  });

  await card.hover();
  await page.waitForTimeout(500);

  const picker1 = (await boardPicker.$$('[data-icon="caret-down"]'))[0];
  const picker2 = (await boardPicker.$$('[data-icon="caret-down"]'))[1];

  await picker1.click();
  await page.waitForTimeout(500);
  let menu = await expect(boardPicker).toMatchElement('ul[data-testid="context-menu"]');

  const newBoardItem = (await menu.$$('li > a'))[1];
  await newBoardItem.click();

  await picker2.click();
  await page.waitForTimeout(500);
  menu = await expect(boardPicker).toMatchElement('ul[data-testid="context-menu"]');

  const newListItem = (await menu.$$('li > a'))[1];
  await newListItem.click();

  await page.hover('div.trello-refresh-button'); /* afasta o mouse pra longe */
  await page.waitForTimeout(500);

  const boardName = await picker1.evaluate((picker) => picker.closest('span').textContent);
  expect(boardName).toBe('Quadro 2');

  const listName = await picker2.evaluate((picker) => picker.closest('span').textContent);
  expect(listName).toBe('Lista 2');
});
