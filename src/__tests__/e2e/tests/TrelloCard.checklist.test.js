import api from './../api';

import { setupBeforeAll, clickTrelloRefreshButton, matchTrelloCard, clickCardButton, matchPanel } from './utils.js';

setupBeforeAll(api);

beforeEach(async () => {
  api.clearCards();
  await clickTrelloRefreshButton();
});

test('render card checklist', async () => {
  api.addCard({
    id: 'card1',
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');

  await clickCardButton(card, 'Checklist');
  const panel = await matchPanel(card, 'Checklist');
});
