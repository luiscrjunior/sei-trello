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

export const matchCreateCardButton = async (processNumber) => {
  const anchor = await expect(page).toMatchElement('a[class^="processo"]', {
    text: processNumber,
    visible: true,
  });
  const tr = await anchor.evaluateHandle((anchor) => anchor.closest('tr'));
  return await expect(tr).toMatchElement('div.trello-create-card-button > a', {
    visible: true,
  });
};

test('rendered create buttons', async () => {
  /* checar se existem os botões de criar cartão para cada processo */
  await matchCreateCardButton('00000.000001/2020-01');
  await matchCreateCardButton('00000.000002/2020-02');
  await matchCreateCardButton('00000.000003/2020-03');
});

test('create first card', async () => {
  /* primeiro cartão o anchor não possui especificação do processo nem nota */
  const createCardButton = await matchCreateCardButton('00000.000001/2020-01');
  await createCardButton.click();
  await page.waitForTimeout(500);
  const card = await matchTrelloCard('00000.000001/2020-01');
  await expect(matchCreateCardButton('00000.000001/2020-01')).rejects.toThrow(); /* botão de criar botão desaparece */
  await matchTrelloCardTitle(card, '00000.000001/2020-01'); /* título do cartão é o próprio número do processo */
  await matchTrelloCardDescription(card, 'Clique para editar...'); /* sem descrição */
});

test('create second card', async () => {
  /* segundo cartão o anchor possui especificação do processo, mas não tem nota */
  const createCardButton = await matchCreateCardButton('00000.000002/2020-02');
  await createCardButton.click();

  await page.waitForTimeout(500);
  const card = await matchTrelloCard('00000.000002/2020-02');
  await expect(matchCreateCardButton('00000.000002/2020-02')).rejects.toThrow(); /* botão de criar botão desaparece */
  await matchTrelloCardTitle(card, 'Especificação do processo'); /* título do cartão é a especificação */
  await matchTrelloCardDescription(card, 'Clique para editar...'); /* sem descrição */
});

test('create third card', async () => {
  /* terceiro cartão o anchor possui especificação do processo e uma nota */
  const createCardButton = await matchCreateCardButton('00000.000003/2020-03');
  await createCardButton.click();

  await page.waitForTimeout(500);
  const card = await matchTrelloCard('00000.000003/2020-03');
  await expect(matchCreateCardButton('00000.000003/2020-03')).rejects.toThrow(); /* botão de criar botão desaparece */
  await matchTrelloCardTitle(card, 'Especificação do processo'); /* título do cartão é a especificação */
  await matchTrelloCardDescription(card, 'Dados da nota'); /* descrição é o corpo da nota */
});
