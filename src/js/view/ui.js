import React from 'react';
import ReactDOM from 'react-dom';

import TrelloCard from './components/TrelloCard';
import TrelloButton from './components/TrelloButton';
import AddTrelloCardButton from './components/AddTrelloCardButton';

import * as store from 'model/store.js';
import * as actions from 'actions/trello.js';

const renderMainButton = (placeholder, data) => {
  ReactDOM.render(
    <TrelloButton
      onClick={() => actions.refreshAllCards()}
      isLoading={data.isLoading} ></TrelloButton>, placeholder);
};

const renderTrelloCard = (placeholder, cardsForThisProcess, originalAnchor) => {

  const card = cardsForThisProcess[0]; /* consider first card */

  ReactDOM.render(
    <TrelloCard
      {...card}
      refreshCard={(cardID) => actions.refreshCardData(cardID) }
      deleteCard={(cardID) => actions.deleteCard(cardID) }
      onChangeName={(cardID, newName) => actions.updateCardData(cardID, {name: newName}) }
      onChangeDescription={(cardID, newDescription) => actions.updateCardData(cardID, { description: newDescription }) }
      hasAnotherCard={cardsForThisProcess.length > 1}
      originalAnchor={originalAnchor} ></TrelloCard>,
    placeholder
  );
};

const renderAddTrelloCardButton = (placeholder, processNumber, data) => {
  ReactDOM.render(
    <AddTrelloCardButton
      isAdding={data.isAddingCardFor && processNumber === data.isAddingCardFor}
      processNumber={processNumber}
      onClick={(processNumber) => actions.addCardFor(processNumber, placeholder) }></AddTrelloCardButton>
    , placeholder);
};

const renderTrelloCardInARow = (row, data) => {

  const tds = row.querySelectorAll('td');
  const processAnchor = tds[2].querySelector('a');
  const cardAnchor = tds[2].querySelector('.trello-card-placeholder');

  if (!processAnchor) return;

  const processNumber = processAnchor.textContent.trim();
  const cardsForThisProcess = data.cards
    .filter((card) => card.processNumber === processNumber);

  const hasTrelloCard = (cardsForThisProcess.length > 0);

  /* render create card button */
  const createCardPlaceholder = tds[1].querySelector('.trello-create-card-button-placeholder');
  renderAddTrelloCardButton(createCardPlaceholder, processNumber, data);
  createCardPlaceholder.style.display = hasTrelloCard ? 'none' : 'inline-block';

  if (hasTrelloCard) {
    /* render trello card */
    processAnchor.style.display = 'none';
    cardAnchor.style.display = 'block';
    renderTrelloCard(cardAnchor, cardsForThisProcess, processAnchor);

  } else {
    /* remove trello card */
    ReactDOM.unmountComponentAtNode(cardAnchor);
    processAnchor.style.display = 'block';
    cardAnchor.style.display = 'none';
  }

};

export const render = (targets) => {

  const data = store.getData();

  targets.forEach((target) => {
    if (target.type === 'main-button') {
      renderMainButton(target.ref, data);
    } else if (target.type === 'process-row') {
      renderTrelloCardInARow(target.ref, data);
    }
  });
};
