import { format, formatISO, addDays, subDays } from 'date-fns';

import {
  MockedTrelloApi,
  setupBeforeAll,
  clickTrelloRefreshButton,
  matchTrelloCard,
  clickCardButton,
  matchPanel,
} from './utils.js';

setupBeforeAll();

beforeEach(async () => {
  MockedTrelloApi.clearCards();
  await clickTrelloRefreshButton();
});

const matchSaveButton = async (duePanel) =>
  await expect(duePanel).toMatchElement('button', { text: 'Salvar', visible: true });

const matchRemoveButton = async (duePanel) =>
  await expect(duePanel).toMatchElement('button', { text: 'Remover', visible: true });

const matchDueCompleteSwitch = async (duePanel) =>
  await expect(duePanel).toMatchElement('div.switch', { visible: true });

const matchDatePicker = async (duePanel) =>
  await expect(duePanel).toMatchElement('div.react-datepicker', { visible: true });

const DuePanel = (_card) => {
  let card = _card;
  let saveButton = null;
  let removeButton = null;
  let dueSwitch = null;
  let datePicker = null;

  return {
    openPanel: async () => {
      await clickCardButton(card, 'Especificar data de entrega');
      const panel = await matchPanel(card, 'Data de entrega');
      saveButton = await matchSaveButton(panel);
      removeButton = await matchRemoveButton(panel);
      dueSwitch = await matchDueCompleteSwitch(panel);
      datePicker = await matchDatePicker(panel);
    },
    selectDate: async (type, number) => {
      const days = await datePicker.$$('div.react-datepicker__day');
      let todayIdx = -1;
      for (let i = 0; i < days.length; i++) {
        if (await days[i].evaluate((node) => node.classList.contains('react-datepicker__day--today'))) {
          todayIdx = i;
        }
      }
      if (todayIdx === -1) return;
      let chosenDay = days[todayIdx];
      if (type === 'add') chosenDay = days[todayIdx + number];
      if (type === 'sub') chosenDay = days[todayIdx - number];
      await chosenDay.click();
    },
    clickSaveButton: async () => {
      await saveButton.click();
      await page.waitForTimeout(500);
    },
    clickRemoveButton: async () => {
      await removeButton.click();
      await page.waitForTimeout(500);
    },
    clickDueSwitch: async () => {
      await dueSwitch.click();
      await page.waitForTimeout(500);
    },
  };
};

test('render card with due', async () => {
  MockedTrelloApi.addCard({
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
  MockedTrelloApi.updateCard('card1', { due: formatISO(dueDate), dueComplete: false });
  await clickCardButton(card, 'Atualizar Cartão');
  await expect(card).toMatchElement('span', { text: `${format(dueDate, 'dd/MM')} hoje` });

  /* cartão com prazo para amanhã */
  dueDate = addDays(new Date(), 1);
  MockedTrelloApi.updateCard('card1', { due: formatISO(dueDate), dueComplete: false });
  await clickCardButton(card, 'Atualizar Cartão');
  await expect(card).toMatchElement('span', { text: `${format(dueDate, 'dd/MM')} amanhã` });

  /* cartão com prazo para daqui a 2 dias */
  dueDate = addDays(new Date(), 2);
  MockedTrelloApi.updateCard('card1', { due: formatISO(dueDate), dueComplete: false });
  await clickCardButton(card, 'Atualizar Cartão');
  await expect(card).toMatchElement('span', { text: `${format(dueDate, 'dd/MM')} 2 dias` });

  /* cartão com prazo para ontem (atrasado) */
  dueDate = subDays(new Date(), 1);
  MockedTrelloApi.updateCard('card1', { due: formatISO(dueDate), dueComplete: false });
  await clickCardButton(card, 'Atualizar Cartão');
  await expect(card).toMatchElement('span', { text: `${format(dueDate, 'dd/MM')} atrasado` });

  /* cartão com prazo para hoje e concluído */
  dueDate = new Date();
  MockedTrelloApi.updateCard('card1', { due: formatISO(dueDate), dueComplete: true });
  await clickCardButton(card, 'Atualizar Cartão');
  await expect(card).toMatchElement('span', { text: `${format(dueDate, 'dd/MM')} concluído` });
});

test('render due panel', async () => {
  MockedTrelloApi.addCard({
    name: 'Cartão',
    desc: 'SEI 00000.000001/2020-01',
    due: null,
    dueComplete: false,
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');
  await clickCardButton(card, 'Especificar data de entrega');

  const duePanel = await matchPanel(card, 'Data de entrega');

  await matchSaveButton(duePanel);
  await matchRemoveButton(duePanel);
  await matchDueCompleteSwitch(duePanel);
  await matchDatePicker(duePanel);
});

test('modify due date', async () => {
  MockedTrelloApi.addCard({
    name: 'Cartão',
    desc: 'SEI 00000.000001/2020-01',
    due: null,
    dueComplete: false,
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');

  const duePanel = DuePanel(card);

  await duePanel.openPanel();
  await duePanel.selectDate('add', 0); /* hoje */
  await duePanel.clickSaveButton();
  await expect(card).toMatchElement('span', { text: `${format(new Date(), 'dd/MM')} hoje` });

  await duePanel.openPanel();
  await duePanel.selectDate('add', 1); /* amanhã */
  await duePanel.clickSaveButton();
  await expect(card).toMatchElement('span', { text: `${format(addDays(new Date(), 1), 'dd/MM')} amanhã` });

  await duePanel.openPanel();
  await duePanel.selectDate('add', 2); /* dois dias */
  await duePanel.clickSaveButton();
  await expect(card).toMatchElement('span', { text: `${format(addDays(new Date(), 2), 'dd/MM')} 2 dias` });

  await duePanel.openPanel();
  await duePanel.selectDate('sub', 1); /* ontem */
  await duePanel.clickSaveButton();
  await expect(card).toMatchElement('span', { text: `${format(subDays(new Date(), 1), 'dd/MM')} atrasado` });

  await duePanel.openPanel();
  await duePanel.selectDate('add', 0); /* hoje */
  await duePanel.clickDueSwitch();
  await duePanel.clickSaveButton();
  await expect(card).toMatchElement('span', { text: `${format(new Date(), 'dd/MM')} concluído` });

  /* remove a data */
  await duePanel.openPanel();
  await duePanel.clickRemoveButton();
  await expect(card).not.toMatchElement('span', { text: `${format(new Date(), 'dd/MM')} concluído` });
});
