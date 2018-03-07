import React from 'react';
import ReactDOM from 'react-dom';

import TrelloCard from './components/TrelloCard';
import TrelloRefreshButton from './components/TrelloRefreshButton';
import TrelloFilterButton from './components/TrelloFilterButton';
import CreateTrelloCardButton from './components/CreateTrelloCardButton';

import * as store from 'model/store.js';
import * as actions from 'actions/trello.js';

const renderRefreshButton = (placeholder, data) => {
  ReactDOM.render(
    <TrelloRefreshButton
      onClick={() => actions.refreshCards()}
      isLoading={data.isLoading} ></TrelloRefreshButton>, placeholder);
};

const renderFilterButton = (placeholder, data) => {
  ReactDOM.render(
    <TrelloFilterButton
      currentLabels={data.currentLabels}
      filter={data.filter}
      onFilterChange={(type, checked, key) => actions.updateFilter(type, checked, key)}></TrelloFilterButton>, placeholder);
};

const renderTrelloCard = (placeholder, card, hasAnotherCard, originalAnchor) => {

  const fullWidth = placeholder.hasAttribute('full-width');

  ReactDOM.render(
    <TrelloCard
      {...card}
      refreshCard={(cardID) => actions.refreshCardData(cardID) }
      deleteCard={(cardID) => actions.deleteCard(cardID) }
      onChangeName={(cardID, newName) => actions.updateCardData(cardID, {name: newName}) }
      onChangeDescription={(cardID, newDescription) => actions.updateCardData(cardID, { description: newDescription }) }
      hasAnotherCard={hasAnotherCard}
      fullWidth={fullWidth}
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

const checkIfFiltered = (cards, filter) => {

  if (cards.length === 0) return false;

  const card = cards[0];

  if (
    filter.due && filter.due === 'WITH_INCOMPLETE_DUE' &&
    card.due !== null && card.dueComplete === false
  ) return false;

  return true;
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

  // const isFiltered = checkIfFiltered(cardsForThisProcess, data.filter);
  // console.log(isFiltered);
  // if (isFiltered) {
  //   if (!box.classList.contains('hide')) box.classList.add('hide');
  // } else {
  //   if (box.classList.contains('hide')) box.classList.remove('hide');

  // }

};

const updateCurrentLabels = (data, processBoxes) => {

  const allProcess = Array.prototype.slice.call(processBoxes)
    .map((processBox) => processBox.getAttribute('data-trello-process-number'))
    .filter((processBox) => processBox); /* exclude null */

  let uniqLabels = [];
  data.cards
    .filter((card) => allProcess.some((process) => card.processNumber === process))
    .forEach((card) => {
      card.labels.forEach((label) => {
        const labelAlreadyAdded = uniqLabels.some((labelAdded) => labelAdded.color === label.color && labelAdded.label === label.label);
        if (!labelAlreadyAdded) uniqLabels.push(label);
      });
    });

  store.setCurrentLabels(uniqLabels);
};

export const render = () => {

  const data = store.getData();

  const targets = {
    'refresh-button': {
      selector: '.trello-refresh-button',
      fn: renderRefreshButton,
      elements: [],
    },
    'filter-button': {
      selector: '.trello-filter-button',
      fn: renderFilterButton,
      elements: [],
    },
    'process-box': {
      selector: '.trello-process-box',
      fn: renderTrelloBox,
      elements: [],
    },
  };

  /* populate dom elements and execute function */
  for (let k in targets) {
    targets[k].elements = document.querySelectorAll(targets[k].selector);
    for (let i = 0; i < targets[k].elements.length; i++) targets[k].fn(targets[k].elements[i], data);
  }

  updateCurrentLabels(data, targets['process-box'].elements);

};
