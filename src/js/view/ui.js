import React from 'react';
import ReactDOM from 'react-dom';

import TrelloCard from './components/TrelloCard';
import TrelloButton from './components/TrelloButton';
import AddTrelloCardButton from './components/AddTrelloCardButton';

import * as store from 'model/store.js';
import * as actions from 'actions/trello.js';
import * as helper from './helper.js';

const renderMainButton = (placeholder, data) => {
  ReactDOM.render(
    <TrelloButton
      onClick={() => actions.refreshAllCards()}
      isLoading={data.isLoading} ></TrelloButton>, placeholder);
};

const renderTrelloCard = (placeholder, card, hasAnotherCard, originalAnchor) => {

  ReactDOM.render(
    <TrelloCard
      {...card}
      refreshCard={(cardID) => actions.refreshCardData(cardID) }
      deleteCard={(cardID) => actions.deleteCard(cardID) }
      onChangeName={(cardID, newName) => actions.updateCardData(cardID, {name: newName}) }
      onChangeDescription={(cardID, newDescription) => actions.updateCardData(cardID, { description: newDescription }) }
      hasAnotherCard={hasAnotherCard}
      originalAnchor={originalAnchor} ></TrelloCard>,
    placeholder
  );
};

const renderCreateTrelloCardButton = (placeholder, processNumber, data, newCardData) => {
  ReactDOM.render(
    <AddTrelloCardButton
      isAdding={data.isAddingCardFor && processNumber === data.isAddingCardFor}
      processNumber={processNumber}
      onClick={(processNumber) => actions.addCardFor(processNumber, newCardData) }></AddTrelloCardButton>
    , placeholder);
};

const renderTrelloCardInARow = (row, data) => {

  const tds = row.querySelectorAll('td');
  const processAnchor = tds[2].querySelector('a');
  const cardPlaceholder = tds[2].querySelector('.trello-card-placeholder');
  const createCardPlaceholder = tds[1].querySelector('.trello-create-card-button-placeholder');

  if (!processAnchor || !cardPlaceholder || !createCardPlaceholder) return;

  const processNumber = processAnchor.textContent.trim();
  const cardsForThisProcess = data.cards
    .filter((card) => card.processNumber === processNumber);

  const hasTrelloCard = (cardsForThisProcess.length > 0);

  if (hasTrelloCard) {

    /* render trello card */
    processAnchor.style.display = 'none';
    cardPlaceholder.style.display = 'block';
    renderTrelloCard(cardPlaceholder, cardsForThisProcess[0], (cardsForThisProcess.length > 1), processAnchor);

    /* remove create card button */
    createCardPlaceholder.style.display = 'none';
    ReactDOM.unmountComponentAtNode(createCardPlaceholder);

  } else {

    const relevantDataFromRow = helper.extractRelevantDataFromRow(row);
    let newCardData = {};
    if ('processSpecification' in relevantDataFromRow) newCardData.name = relevantDataFromRow['processSpecification'];
    if ('noteDescription' in relevantDataFromRow) newCardData.description = relevantDataFromRow['noteDescription'];

    /* render create card button */
    renderCreateTrelloCardButton(createCardPlaceholder, processNumber, data, newCardData);

    /* remove trello card */
    cardPlaceholder.style.display = 'none';
    processAnchor.style.display = 'block';
    ReactDOM.unmountComponentAtNode(cardPlaceholder);
    createCardPlaceholder.style.display = 'inline-block';

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
