export const clickTrelloRefreshButton = async () => {
  await page.click('div.trello-refresh-button > a');
  await page.waitForTimeout(500);
};

export const matchCardButton = async (card, buttonTitle) =>
  await expect(card).toMatchElement(`a[data-tooltip="${buttonTitle}"]`);

export const clickCardButton = async (card, buttonTitle) => {
  const anchor = await matchCardButton(card, buttonTitle);
  await anchor.click();
  await page.waitForTimeout(500);
};

export const matchTrelloCard = async (processNumber) => {
  const anchor = await expect(page).toMatchElement('div.trello-card a', {
    text: processNumber,
    visible: true,
  });

  return await anchor.evaluateHandle((anchor) => anchor.closest('div.trello-card'));
};

export const matchTrelloCardTitle = async (card, title) => {
  const paragraph = (await card.$$('p'))[0];
  expect(await paragraph.evaluate((node) => node.textContent)).toBe(title);
  return paragraph;
};

export const matchTrelloCardDescription = async (card, description) => {
  const paragraph = (await card.$$('p'))[1];
  expect(await paragraph.evaluate((node) => node.textContent)).toBe(description);
  return paragraph;
};

export const matchPanel = async (card, title) => {
  const p = await expect(card).toMatchElement('[data-testid="panel"] > div:first-child p', {
    text: title,
    visible: true,
  });
  return await p.evaluateHandle((p) => p.closest('[data-testid="panel"]'));
};

export const getCSSProperty = async (elementHandle, propertyName) =>
  await elementHandle.evaluate(
    (node, propertyName) => window.getComputedStyle(node).getPropertyValue(propertyName),
    propertyName
  );

export const isCardButtonHighlighted = async (card, buttonName) => {
  const btn = await matchCardButton(card, buttonName);
  const icon = await btn.$('svg');
  const color = await getCSSProperty(icon, 'color');
  return color === 'rgb(97, 189, 79)';
};

export const MockedTrelloApi = (() => {
  const clearCards = () => {
    page.evaluate(() => window.MockedTrelloApi.clearCards());
  };

  const addCard = (card, cardID) => {
    page.evaluate((card, cardID) => window.MockedTrelloApi.addCard(card, cardID), card, cardID);
  };

  const updateCard = (cardID, cardData) => {
    page.evaluate((cardID, cardData) => window.MockedTrelloApi.updateCard(cardID, cardData), cardID, cardData);
  };

  const setBoards = (newBoards) => {
    page.evaluate((newBoards) => window.MockedTrelloApi.setBoards(newBoards), newBoards);
  };

  const setLists = (newLists) => {
    page.evaluate((newLists) => window.MockedTrelloApi.setLists(newLists), newLists);
  };

  const setLabels = (newLabels) => {
    page.evaluate((newLabels) => window.MockedTrelloApi.setLabels(newLabels), newLabels);
  };

  return {
    clearCards,
    addCard,
    updateCard,
    setBoards,
    setLists,
    setLabels,
  };
})();
