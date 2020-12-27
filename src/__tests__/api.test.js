import * as api from 'api';

beforeEach(() => {
  window.MockedTrelloApi.clearCards();
});

test('set and get credentials', async () => {
  api.setCredentials('key1', 'token1');
  const { key, token } = api.getCredentials();
  expect(key).toBe('key1');
  expect(token).toBe('token1');
});

test('searchAllBoards', async () => {
  window.MockedTrelloApi.setBoards([
    {
      id: 'board1',
      name: 'Quadro 1',
    },
    {
      id: 'board2',
      name: 'Quadro 2',
    },
  ]);

  const result = await api.searchBoardsByName();

  expect(result.data.boards).toEqual([
    expect.objectContaining({ id: 'board1' }),
    expect.objectContaining({ id: 'board2' }),
  ]);
});

test('getListsFromBoard', async () => {
  window.MockedTrelloApi.setLists([
    {
      id: 'list1',
      name: 'Lista 1',
    },
    {
      id: 'list2',
      name: 'Lista 2',
    },
  ]);

  const result = await api.getListsFromBoard('board1');

  expect(result.data.lists).toEqual([
    expect.objectContaining({ id: 'list1' }),
    expect.objectContaining({ id: 'list2' }),
  ]);
});

test('searchCards', async () => {
  window.MockedTrelloApi.addCard({
    id: 'card1',
    name: 'Primeiro Cartão',
  });
  window.MockedTrelloApi.addCard({
    id: 'card2',
    name: 'Segundo Cartão',
  });

  const result = await api.searchCards();

  expect(result.data.cards).toEqual([
    expect.objectContaining({ id: 'card1' }),
    expect.objectContaining({ id: 'card2' }),
  ]);
});

test('getCardData', async () => {
  window.MockedTrelloApi.addCard({
    id: 'card1',
    name: 'Primeiro Cartão',
  });
  window.MockedTrelloApi.addCard({
    id: 'card2',
    name: 'Segundo Cartão',
  });

  const result = await api.getCardData('card1');

  expect(result.data).toEqual(expect.objectContaining({ id: 'card1', name: 'Primeiro Cartão' }));
});

test('createCard', async () => {
  await api.createCard({
    name: 'Nome do cartão',
    desc: 'Descrição do cartão',
    defaultList: {
      id: 'list1',
      name: 'Lista 1',
    },
  });
  const result = await api.getCardData('card1');

  expect(result.data).toEqual(
    expect.objectContaining({ id: 'card1', name: 'Nome do cartão', desc: 'Descrição do cartão' })
  );
});

test('updateCard', async () => {
  window.MockedTrelloApi.addCard({
    id: 'card1',
    name: 'Primeiro Cartão',
  });
  await api.updateCard('card1', {
    name: 'Primeiro Cartão com outro nome',
    desc: 'Nova descrição',
  });
  const result = await api.getCardData('card1');
  expect(result.data).toEqual(
    expect.objectContaining({
      id: 'card1',
      name: 'Primeiro Cartão com outro nome',
      desc: 'Nova descrição',
    })
  );
});

test('deleteCard', async () => {
  window.MockedTrelloApi.addCard({
    id: 'card1',
    name: 'Primeiro Cartão',
  });
  await api.deleteCard('card1');
  const result = await api.getCardData('card1');
  expect(result.data).toEqual({});
});

test('getBoardLabels', async () => {
  window.MockedTrelloApi.setLabels([
    { id: 'label1', name: 'urgente', color: 'red' },
    { id: 'label2', name: 'analisar', color: 'green' },
  ]);
  const result = await api.getBoardLabels('board1');
  expect(result.data).toEqual([
    expect.objectContaining({ id: 'label1', name: 'urgente' }),
    expect.objectContaining({ id: 'label2', name: 'analisar' }),
  ]);
});

test('addLabelToCard', async () => {
  window.MockedTrelloApi.setLabels([
    { id: 'label1', name: 'urgente', color: 'red' },
    { id: 'label2', name: 'analisar', color: 'green' },
  ]);
  window.MockedTrelloApi.addCard({
    id: 'card1',
    name: 'Primeiro Cartão',
    labels: [],
  });
  await api.addLabelToCard('card1', 'label1');
  const result = await api.getCardData('card1');
  expect(result.data.labels).toEqual([expect.objectContaining({ id: 'label1', name: 'urgente' })]);
});

test('removeLabelFromCard', async () => {
  window.MockedTrelloApi.setLabels([
    { id: 'label1', name: 'urgente', color: 'red' },
    { id: 'label2', name: 'analisar', color: 'green' },
  ]);
  window.MockedTrelloApi.addCard({
    id: 'card1',
    name: 'Primeiro Cartão',
    labels: [{ id: 'label1', name: 'urgente', color: 'red' }],
  });

  await api.removeLabelFromCard('card1', 'label1');
  const result = await api.getCardData('card1');
  expect(result.data.labels).toEqual([]);
});

test('createLabel', async () => {
  window.MockedTrelloApi.setLabels([]);
  await api.createLabel('board1', {
    name: 'urgente',
    color: 'red',
  });
  expect(window.MockedTrelloApi.getLabels()).toEqual([{ id: 'label1', color: 'red', name: 'urgente' }]);
});

test('updateLabel', async () => {
  window.MockedTrelloApi.setLabels([{ id: 'label1', name: 'urgente', color: 'red' }]);
  await api.updateLabel('label1', { name: 'não é mais urgente' });
  await api.updateLabel('label1', { color: 'green' });
  expect(window.MockedTrelloApi.getLabels()).toEqual([{ id: 'label1', color: 'green', name: 'não é mais urgente' }]);
});

test('deleteLabel', async () => {
  window.MockedTrelloApi.setLabels([
    { id: 'label1', name: 'urgente', color: 'red' },
    { id: 'label2', name: 'analisar', color: 'green' },
  ]);
  await api.deleteLabel('label1');
  expect(window.MockedTrelloApi.getLabels()).toEqual([{ id: 'label2', color: 'green', name: 'analisar' }]);
});
