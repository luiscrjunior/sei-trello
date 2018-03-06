import { isEqual } from 'underscore';

let initialData = {
  isLoading: false,
  isAddingCardFor: null,
  cards: [],
  filter: {
    process: null,
    labels: null,
    due: null,
  },
  currentLabels: [],
};

let data = Object.assign({}, initialData);

let events = [];

const triggerEvent = (type) => {
  events.forEach((event) => {
    if (event.type === type) {
      setTimeout(() => {
        event.callback();
      }, 10);
    }
  });
};

export const getData = () => {
  return data;
};

export const resetData = () => {
  data = Object.assign({}, initialData);
};

export const setCards = (cards) => {
  data.cards = cards;
  triggerEvent('onDataChanged');
};

export const updateCardsWithID = (cardID, updatedCards) => {

  /* remove all cards that matches cardID */
  data.cards = data.cards.filter((card) => card.cardID !== cardID);

  /* add new cards (can be nothing, if the card was removed) */
  data.cards = data.cards.concat(updatedCards);

  triggerEvent('onDataChanged');
};

export const addCards = (newCards) => {
  data.cards = data.cards.concat(newCards);
  triggerEvent('onDataChanged');
};

export const onDataChanged = (fn) => {
  events.push({
    type: 'onDataChanged',
    callback: fn,
  });
};

export const setIsLoading = (isLoading) => {
  data.isLoading = isLoading;
  data.cards.forEach((card) => { card.isLoading = isLoading; });
  triggerEvent('onDataChanged');
};

export const setIsAddingFor = (processNumber) => {
  if (!processNumber) {
    data.isLoading = false;
    data.isAddingCardFor = null;
  } else {
    data.isLoading = true;
    data.isAddingCardFor = processNumber;
  }
  triggerEvent('onDataChanged');
};

export const getAllProcesssFromCardID = (cardID) => {
  return data.cards
    .filter((card) => card.cardID === cardID)
    .map((card) => card.processNumber);
};

export const updateCardsData = (cardID, newData) => {
  data.cards
    .filter((card) => card.cardID === cardID)
    .map((card) => Object.assign(card, newData));
  triggerEvent('onDataChanged');
};

export const setCurrentLabels = (labels) => {
  if (!isEqual(labels, data.currentLabels)) {
    data.currentLabels = labels;
    triggerEvent('onDataChanged');
  }
};
