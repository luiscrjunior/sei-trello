import React from 'react';
import ReactDOM from 'react-dom';

import TrelloCard from './components/TrelloCard';
import TrelloButton from './components/TrelloButton';
import CreateTrelloCardButton from './components/CreateTrelloCardButton';

import * as store from 'model/store.js';
import * as actions from 'actions/trello.js';

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
    <CreateTrelloCardButton
      isAdding={data.isAddingCardFor && processNumber === data.isAddingCardFor}
      processNumber={processNumber}
      onClick={(processNumber) => actions.addCardFor(processNumber, newCardData) }></CreateTrelloCardButton>
    , placeholder);
};

const renderTrelloBox = (box, data) => {

  const processNumber = box.getAttribute('data-trello-process-number');
  const processAnchor = box.querySelector('.trello-process-anchor');
  const cardPlaceholder = box.querySelector('.trello-card');
  const createCardPlaceholder = box.querySelector('.trello-create-card-button');

  if (!processNumber || !cardPlaceholder || !createCardPlaceholder) return;

  const cardsForThisProcess = data.cards
    .filter((card) => card.processNumber === processNumber);

  const hasTrelloCard = (cardsForThisProcess.length > 0);

  if (hasTrelloCard) {

    /* render trello card */
    if (processAnchor) processAnchor.classList.add('hide');
    cardPlaceholder.classList.remove('hide');
    renderTrelloCard(cardPlaceholder, cardsForThisProcess[0], (cardsForThisProcess.length > 1), processAnchor);

    /* remove create card button */
    createCardPlaceholder.classList.add('hide');
    ReactDOM.unmountComponentAtNode(createCardPlaceholder);

  } else {

    let newCardData = {};
    if (box.hasAttribute('data-trello-process-specification')) newCardData.name = box.getAttribute('data-trello-process-specification');
    if (box.hasAttribute('data-trello-note-description')) newCardData.description = box.getAttribute('data-trello-note-description');

    /* render create card button */
    renderCreateTrelloCardButton(createCardPlaceholder, processNumber, data, newCardData);
    createCardPlaceholder.classList.remove('hide');

    /* remove trello card */
    cardPlaceholder.classList.add('hide');
    if (processAnchor) processAnchor.classList.remove('hide');
    ReactDOM.unmountComponentAtNode(cardPlaceholder);

  }

};

export const render = () => {

  const data = store.getData();

  const targets = [
    {
      selector: '.trello-main-button',
      fn: renderMainButton,
    },
    {
      selector: '.trello-process-box',
      fn: renderTrelloBox,
    },
  ];

  targets.forEach((target) => {
    const elements = document.querySelectorAll(target.selector);
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      target.fn(element, data);
    }
  });

};
