import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import initialCards from './data/cards.js';
import initialBoards from './data/boards.js';
import initialLists from './data/lists.js';
import initialLabels from './data/labels.js';

const Api = () => {
  let cards = [...initialCards];
  let boards = [...initialBoards];
  let lists = [...initialLists];
  let labels = [...initialLabels];
  let delay = 0;

  const setup = () => {
    const mock = new MockAdapter(axios, { onNoMatch: 'passthrough' });
    const regex = /https:\/\/api.trello.com\/1\/(.*)/;
    mock.onAny(regex).reply(async (config) => {
      const { method, url, params, data } = config;
      const path = url.match(regex)[1];
      const response = handleRequests(method, path, params, data ? JSON.parse(data) : {});
      return new Promise((resolve) => setTimeout(() => resolve([200, response]), delay));
    });
  };

  const setDelay = (_delay) => (delay = _delay);

  const emptyCardData = (cardID) => ({
    id: cardID,
    name: '',
    desc: '',
    due: null,
    dueComplete: false,
    checklists: [],
    idChecklists: [],
    labels: [],
    board: boards[0],
    list: lists[0],
    shortUrl: `https://trello.com/c/${cardID}`,
  });

  const getGreaterPos = (arr) =>
    arr.reduce((acc, item) => {
      return item.pos > acc ? item.pos : acc;
    }, 0);

  const getLowerPos = (arr) =>
    arr.reduce((acc, item) => {
      return item.pos < acc ? item.pos : acc;
    }, 0);

  const getBoardById = (boardID) => boards.find((board) => board.id === boardID);
  const getListById = (listID) => lists.find((list) => list.id === listID);
  const getCardById = (cardID) => cards.find((card) => card.id === cardID);
  const getLabelById = (labelID) => labels.find((label) => label.id === labelID);

  const updateCardData = (cardID, data) => {
    if ('idBoard' in data) {
      data.board = getBoardById(data.idBoard);
      delete data['idBoard'];
    }
    if ('idList' in data) {
      data.list = getListById(data.idList);
      delete data['idList'];
    }
    if (data.due === 'null') data.due = null;
    cards = cards.map((card) => (card.id === cardID ? { ...card, ...data } : card));
    return getCardById(cardID);
  };

  const createCard = (data) => {
    const id = `card${cards.length + 1}`;
    const newCard = {
      ...emptyCardData(id),
      name: data.name,
      desc: data.desc,
    };
    cards = [...cards, newCard];
    return newCard;
  };

  const deleteCard = (cardID) => {
    cards = cards.filter((card) => card.id !== cardID);
    return true;
  };

  const createChecklist = (data) => {
    const card = getCardById(data.idCard);
    const checklist = {
      id: `${card.id}_checklist${card.checklists.length + 1}`,
      idBoard: card.board.id,
      idCard: card.id,
      name: data.name,
      checkItems: [],
    };
    updateCardData(data.idCard, { checklists: [...card.checklists, checklist] });
    return checklist;
  };

  const addChecklistItem = (checklistID, data) => {
    for (const card of cards) {
      for (const checklist of card.checklists) {
        if (checklist.id === checklistID) {
          const greaterPos = getGreaterPos(checklist.checkItems);
          const checkItem = {
            id: `${checklist.id}_checkitem${checklist.checkItems.length + 1}`,
            idChecklist: checklistID,
            name: data.name,
            state: data.state,
            pos: greaterPos + 100,
          };
          checklist.checkItems.push(checkItem);
          return checkItem;
        }
      }
    }
    return null;
  };

  const updateChecklistItem = (cardID, checkItemID, data) => {
    const card = getCardById(cardID);
    for (const checklist of card.checklists) {
      for (const checkItem of checklist.checkItems) {
        if (checkItem.id === checkItemID) {
          if ('name' in data) checkItem.name = data.name;
          if ('state' in data) checkItem.state = data.state;
          if ('pos' in data) {
            if (data.pos === 'top') {
              checkItem.pos = getLowerPos(checklist.checkItems) - 100;
            } else if (data.pos === 'bottom') {
              checkItem.pos = getGreaterPos(checklist.checkItems) + 100;
            } else {
              checkItem.pos = data.pos;
            }
          }
          return checkItem;
        }
      }
    }
    return null;
  };

  const deleteChecklistItem = (checklistID, checkItemID) => {
    for (const card of cards) {
      for (const checklist of card.checklists) {
        if (checklist.id === checklistID) {
          checklist.checkItems = checklist.checkItems.filter((checkItem) => checkItem.id !== checkItemID);
        }
      }
    }
    return null;
  };

  const deleteCardChecklist = (checklistID) => {
    for (const card of cards) {
      card.checklists = card.checklists.filter((checklist) => checklist.id !== checklistID);
    }
    return null;
  };

  const addLabelToCard = (cardID, labelID) => {
    removeLabelFromCard(cardID, labelID);
    const card = getCardById(cardID);
    const label = getLabelById(labelID);
    card.labels = [...card.labels, { ...label }];
  };

  const removeLabelFromCard = (cardID, labelID) => {
    const card = getCardById(cardID);
    card.labels = card.labels.filter((label) => label.id !== labelID);
  };

  const createLabel = (labelData) => {
    labels = [
      ...labels,
      {
        id: `label${labels.length + 1}`,
        name: labelData.name,
        color: labelData.color,
      },
    ];
  };
  const handleRequests = (method, path, params = {}, data = {}) => {
    let match = null;

    /* searchCards */
    if (method === 'get' && path.match(/^search$/) && params.modelTypes === 'cards') {
      return { cards: cards };

      /* searchAllBoards and searchBoardsByName */
    } else if (method === 'get' && path.match(/^search$/) && params.modelTypes === 'boards') {
      return { boards: boards };

      /* getListsFromBoard */
    } else if (method === 'get' && path.match(/^boards\/[^/]+$/) && params.lists === 'open') {
      return { lists: lists };

      /* getCardData */
    } else if (method === 'get' && (match = path.match(/^cards\/([^/]+)$/))) {
      const [, cardID] = match;
      return { ...getCardById(cardID) };

      /* updateCard */
    } else if (method === 'put' && (match = path.match(/^cards\/([^/]+)$/))) {
      const [, cardID] = match;
      // eslint-disable-next-line no-unused-vars
      const { key, token, ...cardData } = data;
      return { ...updateCardData(cardID, cardData) };

      /* createCard */
    } else if (method === 'post' && (match = path.match(/^cards$/))) {
      const cardData = createCard(data);
      return cardData;

      /* deleteCard */
    } else if (method === 'delete' && (match = path.match(/^cards\/([^/]+)$/))) {
      const [, cardID] = match;
      deleteCard(cardID);
      return {};

      /* getCardChecklistData */
    } else if (
      method === 'get' &&
      (match = path.match(/^cards\/([^/]+)\/checklists$/)) &&
      params.checkItems === 'all'
    ) {
      const [, cardID] = match;
      return getCardById(cardID).checklists;

      /* createCardChecklist */
    } else if (method === 'post' && (match = path.match(/^checklists$/))) {
      // eslint-disable-next-line no-unused-vars
      const checklist = createChecklist(data);
      return checklist;

      /* createCardChecklistItem */
    } else if (method === 'post' && (match = path.match(/^checklists\/([^/]+)\/checkItems$/))) {
      const [, checklistID] = match;
      const checkItem = addChecklistItem(checklistID, data);
      return checkItem;

      /* updateCardChecklistItem */
    } else if (method === 'put' && (match = path.match(/^cards\/([^/]+)\/checkItem\/([^/]+)$/))) {
      const [, cardID, checkItemID] = match;
      // eslint-disable-next-line no-unused-vars
      const checkItem = updateChecklistItem(cardID, checkItemID, data);
      return checkItem;

      /* deleteCardChecklistItem */
    } else if (method === 'delete' && (match = path.match(/^checklists\/([^/]+)\/checkItems\/([^/]+)$/))) {
      const [, checklistID, checkItemID] = match;
      deleteChecklistItem(checklistID, checkItemID);
      return {};

      /* deleteCardChecklist */
    } else if (method === 'delete' && (match = path.match(/^checklists\/([^/]+)$/))) {
      const [, checklistID] = match;
      deleteCardChecklist(checklistID);
      return {};

      /* getBoardLabels */
    } else if (method === 'get' && (match = path.match(/^boards\/[^/]+\/labels$/))) {
      return labels;

      /* addLabelToCard */
    } else if (method === 'post' && (match = path.match(/^cards\/([^/]+)\/idLabels$/))) {
      const [, cardID] = match;
      const labelID = data.value;
      addLabelToCard(cardID, labelID);
      return {};

      /* removeLabelFromCard */
    } else if (method === 'delete' && (match = path.match(/^cards\/([^/]+)\/idLabels\/([^/]+)/))) {
      const [, cardID, labelID] = match;
      removeLabelFromCard(cardID, labelID);
      return {};

      /* createLabel */
    } else if (method === 'post' && (match = path.match(/^labels$/))) {
      createLabel(data);
      return {};

      /* outros requests */
    } else {
      return null;
    }
  };

  return {
    setup: setup,
    setDelay: setDelay,
    clearCards: () => (cards = []),
    getLabels: () => labels,
    addCard: (card, cardID = 'card1') =>
      (cards = [
        ...cards,
        {
          ...emptyCardData(cardID),
          ...card,
        },
      ]),
    updateCard: updateCardData,
    setBoards: (newBoards) => (boards = newBoards),
    setLists: (newLists) => (lists = newLists),
    setLabels: (newLabels) => (labels = newLabels),
  };
};

export default Api();
