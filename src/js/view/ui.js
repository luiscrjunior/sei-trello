import React from 'react';
import ReactDOM from 'react-dom';

import TrelloCard from './components/TrelloCard';
import TrelloButton from './components/TrelloButton';
import AddTrelloCardButton from './components/AddTrelloCardButton';

import * as store from 'model/store.js';
import * as sei from './utils/sei.js';
import * as trelloController from 'controller/trello.js';

let placeholders = [];

export const mapAllPlaceholders = () => {
  const anchors = sei.findAllProcessAnchors();
  placeholders = anchors.map((anchor) => {
    return {
      processNumber: anchor.textContent.trim(),
      originalAnchor: anchor,
      hasTrelloCard: false,
      tableRow: anchor.parentNode.parentNode,
      tableRowOriginal: anchor.parentNode.parentNode.cloneNode(true),
    };
  });
};

const findPlaceholderByProcessNumber = (processNumber) => {
  return placeholders.find((placeholder) => placeholder.processNumber === processNumber);
};

const renderTrelloCard = (placeholder, card) => {
  const tds = placeholder.tableRow.querySelectorAll('td');
  ReactDOM.render(
    <TrelloCard
      {...card}
      refreshCard={(cardID) => trelloController.refreshCardData(cardID) }
      deleteCard={(cardID) => trelloController.deleteCard(cardID) }
      onChangeName={(cardID, newName) => trelloController.updateCardData(cardID, {name: newName}) }
      onChangeDescription={(cardID, newDescription) => trelloController.updateCardData(cardID, { description: newDescription }) }
      hasAnotherCard={store.getAllCardsWithProcessNumber(card.processNumber).length > 1}
      originalAnchor={placeholder.originalAnchor} ></TrelloCard>,
    tds[2]
  );

  placeholder.hasTrelloCard = true;

};

const removeTrelloCard = (placeholder) => {
  /* unmount component */
  const tds = placeholder.tableRow.querySelectorAll('td');
  ReactDOM.unmountComponentAtNode(tds[2]);

  /* replace row with the original */
  const newRow = placeholder.tableRowOriginal.cloneNode(true);
  placeholder.tableRow.replaceWith(newRow);
  placeholder.tableRow = newRow;
  placeholder.hasTrelloCard = false;
};

const removeObsoletTrelloCards = (cards) => {
  const placeholdersWithTrelloCards = placeholders.filter((placeholder) => placeholder.hasTrelloCard);
  placeholdersWithTrelloCards.forEach((placeholderWithTrelloCard) => {
    const processNumber = placeholderWithTrelloCard.processNumber;
    const isThereACard = cards.some((card) => card.processNumber === processNumber);
    if (!isThereACard) removeTrelloCard(placeholderWithTrelloCard);
  });
};

const renderAddTrelloCardButtons = (isAddingCardFor) => {

  placeholders.forEach((placeholder) => {
    const addButtonPlaceholder = placeholder.tableRow.querySelector('.trello-add-card-button-placeholder');
    ReactDOM.render(
      <AddTrelloCardButton
        isAdding={isAddingCardFor && placeholder.processNumber === isAddingCardFor}
        processNumber={placeholder.processNumber}
        onClick={(processNumber) => trelloController.addCardFor(processNumber, placeholder) }
        show={!placeholder.hasTrelloCard}></AddTrelloCardButton>, addButtonPlaceholder);
  });

};

export const renderAll = () => {

  const data = store.getData();

  /* render Trello Button */
  const buttonPlaceholder = document.querySelector('#trello-button-placeholder');
  ReactDOM.render(
    <TrelloButton
      onClick={() => trelloController.updateAllData()}
      isLoading={data.isLoading} ></TrelloButton>, buttonPlaceholder);

  /* render new (or re-render existent) Trello Cards */
  data.cards.forEach((card) => {
    const placeholder = findPlaceholderByProcessNumber(card.processNumber);
    if (!placeholder) return; /* este processo não está na tela */
    renderTrelloCard(placeholder, card);
  });

  /* remove Trello Cards that aren't in the list */
  removeObsoletTrelloCards(data.cards);

  /* add (update) add cards buttons */
  renderAddTrelloCardButtons(data.isAddingCardFor);
};
