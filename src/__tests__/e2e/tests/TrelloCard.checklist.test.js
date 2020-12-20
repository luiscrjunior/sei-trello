import api from './../api';

import { setupBeforeAll, clickTrelloRefreshButton, matchTrelloCard, clickCardButton, matchPanel } from './utils.js';

setupBeforeAll(api);

beforeEach(async () => {
  api.clearCards();
  await clickTrelloRefreshButton();
});

const matchAddTaskButton = async (panel) =>
  await expect(panel).toMatchElement('div > ul ~ div > button', { text: 'Adicionar', visible: true });

const matchTaskDescription = async (panel, description) =>
  await expect(panel).toMatchElement('div > ul > li p', { text: description, visible: true });

const taskChecked = async (panel, paragraph) =>
  (await paragraph.evaluate((p) =>
    window.getComputedStyle(p.closest('li').querySelector('div:nth-child(1)')).getPropertyValue('background-color')
  )) === 'rgb(91, 164, 207)' && (await paragraph.evaluate((p) => p.style.textDecoration)) === 'line-through';

const addTask = async (panel, description) => {
  const addTaskButton = await matchAddTaskButton(panel);
  await addTaskButton.click();
  const lastListItem = await panel.$('div > ul > li:last-child');
  await expect(lastListItem).toMatchElement('button', { text: 'Cancelar', visible: true });
  await expect(lastListItem).toFill('textarea', description);
  await expect(lastListItem).toClick('button', { text: 'Adicionar', visible: true });
  await page.waitForTimeout(500);
};

const getTasks = async (panel) =>
  await panel.evaluate((panel) =>
    Array.from(panel.querySelectorAll('div > ul > li')).map((li) => li.querySelector('p').textContent)
  );

const dragAndDrop = async (origin, destination) => {
  const ob = await origin.boundingBox();
  const db = await destination.boundingBox();

  await page.mouse.move(ob.x + ob.width / 2, ob.y + ob.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(500);

  let destY = db.y + db.height / 2;
  if (db.y > ob.y) destY += 5;
  if (db.y < ob.y) destY -= 5;

  await page.mouse.move(db.x + db.width / 2, destY);
  await page.mouse.up();

  await page.waitForTimeout(500);
};

test('render card without checklists', async () => {
  api.addCard({
    id: 'card1',
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
    checklists: [],
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');

  await clickCardButton(card, 'Checklist');
  const panel = await matchPanel(card, 'Checklist');

  await expect(panel).toMatch('Você não possui itens no checklist.');
});

test('render card with checklists', async () => {
  api.addCard({
    id: 'card1',
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
    checklists: [
      {
        id: `card1_checklist1`,
        idBoard: 'board1',
        idCard: 'card1',
        name: 'Checklist',
        checkItems: [
          {
            id: `card1_checklist1_checkitem1`,
            idChecklist: 'card1_checklist1',
            name: 'Minha primeira tarefa',
            state: 'complete',
            pos: 0,
          },
          {
            id: `card1_checklist1_checkitem2`,
            idChecklist: 'card1_checklist1',
            name: 'Minha segunda tarefa',
            state: 'incomplete',
            pos: 100,
          },
        ],
      },
    ],
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');

  await clickCardButton(card, 'Checklist');
  const panel = await matchPanel(card, 'Checklist');

  const p1 = await matchTaskDescription(panel, 'Minha primeira tarefa');
  const p2 = await matchTaskDescription(panel, 'Minha segunda tarefa');

  expect(await taskChecked(panel, p1)).toBe(true);
  expect(await taskChecked(panel, p2)).toBe(false);
});

test('add checklists', async () => {
  api.addCard({
    id: 'card1',
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
    checklists: [],
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');

  await clickCardButton(card, 'Checklist');
  const panel = await matchPanel(card, 'Checklist');

  await addTask(panel, 'Primeira tarefa');
  await addTask(panel, 'Segunda tarefa');
  await addTask(panel, 'Terceira tarefa');

  await matchTaskDescription(panel, 'Primeira tarefa');
  await matchTaskDescription(panel, 'Segunda tarefa');
  await matchTaskDescription(panel, 'Terceira tarefa');
});

test('update and remove checklist', async () => {
  api.addCard({
    id: 'card1',
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
    checklists: [],
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');

  await clickCardButton(card, 'Checklist');
  const panel = await matchPanel(card, 'Checklist');

  await addTask(panel, 'Minha tarefa');

  let paragraph = await matchTaskDescription(panel, 'Minha tarefa');
  expect(await taskChecked(panel, paragraph)).toBe(false);

  const li = await paragraph.evaluateHandle((p) => p.closest('li'));

  /* testar o botão de cancelar */
  await paragraph.click();
  const btnCancel = await expect(li).toMatchElement('button', { text: 'Cancelar', visible: true });
  await btnCancel.click();
  paragraph = await matchTaskDescription(panel, 'Minha tarefa');

  /* testa o botão de salvar */
  await paragraph.click();
  await expect(li).toFill('textarea', 'Minha tarefa atualizada');
  const btnSave = await expect(li).toMatchElement('button', { text: 'Salvar', visible: true });
  await btnSave.click();
  await page.waitForTimeout(500);
  paragraph = await matchTaskDescription(panel, 'Minha tarefa atualizada');

  /* testa o checkbox */
  const checkbox = await paragraph.evaluateHandle((p) => p.closest('li').querySelector('div:nth-child(1)'));
  await checkbox.click();
  await page.waitForTimeout(500);
  expect(await taskChecked(panel, paragraph)).toBe(true);

  /* testa o botão de remover */
  await paragraph.click();
  const btnRemove = await expect(li).toMatchElement('button', { text: 'Remover', visible: true });
  await btnRemove.click();
  await page.waitForTimeout(500);
  await expect(matchTaskDescription(panel, 'Minha tarefa atualizada')).rejects.toThrow();
  await expect(panel).toMatch('Você não possui itens no checklist.');
});

test('change checklists positions', async () => {
  api.addCard({
    id: 'card1',
    name: 'Título do cartão',
    desc: 'SEI 00000.000001/2020-01',
    checklists: [],
  });
  await clickTrelloRefreshButton();
  const card = await matchTrelloCard('00000.000001/2020-01');

  await clickCardButton(card, 'Checklist');
  const panel = await matchPanel(card, 'Checklist');

  await addTask(panel, 'Primeira tarefa');
  await addTask(panel, 'Segunda tarefa');
  await addTask(panel, 'Terceira tarefa');

  expect(await getTasks(panel)).toEqual(['Primeira tarefa', 'Segunda tarefa', 'Terceira tarefa']);

  /* primeiro pelo segundo */
  await dragAndDrop(
    await matchTaskDescription(panel, 'Primeira tarefa'),
    await matchTaskDescription(panel, 'Segunda tarefa')
  );
  expect(await getTasks(panel)).toEqual(['Segunda tarefa', 'Primeira tarefa', 'Terceira tarefa']);

  /* primeiro pelo último */
  await dragAndDrop(
    await matchTaskDescription(panel, 'Segunda tarefa'),
    await matchTaskDescription(panel, 'Terceira tarefa')
  );
  expect(await getTasks(panel)).toEqual(['Primeira tarefa', 'Terceira tarefa', 'Segunda tarefa']);

  /* último pelo primeiro */
  await dragAndDrop(
    await matchTaskDescription(panel, 'Segunda tarefa'),
    await matchTaskDescription(panel, 'Primeira tarefa')
  );
  expect(await getTasks(panel)).toEqual(['Segunda tarefa', 'Primeira tarefa', 'Terceira tarefa']);
});
