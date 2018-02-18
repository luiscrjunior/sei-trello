let initialData = {
  isLoading: false,
  boards: [],
  cards: [],
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

const clearBoardsList = () => {
  data.boards.forEach((board) => {
    board.lists = [];
  });
};

export const getBoardFromID = (boardID) => {
  return data.boards.find((board) => board.id === boardID);
};

export const getListFromID = (boardID, listID) => {
  return getBoardFromID(boardID).lists.find((list) => list.id === listID);
};

export const getData = () => {
  return data;
};

export const resetData = () => {
  data = Object.assign({}, initialData);
};

export const setBoards = (boards) => {
  data.boards = boards;
  clearBoardsList();
  triggerEvent('onDataChanged');
};

export const setLists = (lists) => {
  clearBoardsList();
  lists.forEach((list) => {
    let board = getBoardFromID(list.boardID);
    if (board) {
      delete list['boardID'];
      board.lists.push(list);
    }
  });
  triggerEvent('onDataChanged');
};

const updateCardsBoardsAndLists = () => {
  data.cards.forEach((card) => {
    if (!card.location.board.name) card.location.board = getBoardFromID(card.location.board.id);
    if (!card.location.list.name) card.location.list = getListFromID(card.location.board.id, card.location.list.id);
  });
};

export const setCards = (cards) => {
  data.cards = cards;
  updateCardsBoardsAndLists();
  triggerEvent('onDataChanged');
};

export const updateCardsWithID = (cardID, updatedCards) => {

  /* remove all cards that matches cardID */
  data.cards = data.cards.filter((card) => card.cardID !== cardID);

  /* add new cards (can be nothing, if the card was removed) */
  data.cards = data.cards.concat(updatedCards);

  updateCardsBoardsAndLists();
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
