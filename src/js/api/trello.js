import axios from 'axios';

let APP_KEY = '';
let APP_TOKEN = '';

const genAuthData = () => {
  return {
    key: APP_KEY,
    token: APP_TOKEN,
  };
};

export const setKeys = (appKey, appToken) => {
  APP_KEY = appKey;
  APP_TOKEN = appToken;
};

export const searchBoardsByName = (boardName) => {
  const url = 'https://api.trello.com/1/search';

  let params = Object.assign({}, genAuthData(), {
    query: `name:"${boardName}" is:open`,
    modelTypes: 'boards',
    board_fields: 'name',
    boards_limit: '1000',
  });

  return axios.get(url, { params: params });
};

export const searchAllBoards = () => {
  const url = 'https://api.trello.com/1/search';

  let params = Object.assign({}, genAuthData(), {
    query: 'is:open',
    modelTypes: 'boards',
    board_fields: 'name',
    boards_limit: '1000',
  });

  return axios.get(url, { params: params });
};

export const getListsFromBoard = (boardID) => {
  const url = 'https://api.trello.com/1/boards/' + boardID;

  return axios.get(url, {
    params: Object.assign({}, genAuthData(), {
      lists: 'open',
      list_fields: 'id,name',
    }),
  });
};

export const searchCards = (processNumber) => {
  const url = 'https://api.trello.com/1/search';

  let description = 'SEI ';

  if (processNumber) description += processNumber;

  let params = Object.assign({}, genAuthData(), {
    query: `description:${description} is:open`,
    modelTypes: 'cards',
    card_fields: 'name,desc,labels,id,due,dueComplete,shortUrl,idChecklists',
    cards_limit: '1000',
    card_board: 'true',
    card_list: 'true',
  });

  return axios.get(url, { params: params });
};

export const getCardData = (cardID) => {
  const url = 'https://api.trello.com/1/cards/' + cardID;

  let params = Object.assign({}, genAuthData(), {
    fields: 'name,desc,labels,id,due,dueComplete,shortUrl',
    board: 'true',
    list: 'true',
  });

  return axios.get(url, { params: params });
};

export const createCard = (opts) => {
  const url = 'https://api.trello.com/1/cards';

  let params = Object.assign({}, genAuthData(), {
    name: opts.name,
    desc: opts.desc,
    pos: 'bottom',
    idList: opts.defaultList.id,
  });

  return axios.post(url, params);
};

export const updateCard = (cardID, opts) => {
  const url = 'https://api.trello.com/1/cards/' + cardID;

  let params = Object.assign({}, genAuthData(), opts);

  return axios.put(url, params);
};

export const deleteCard = (cardID) => {
  const url = 'https://api.trello.com/1/cards/' + cardID;

  let params = Object.assign({}, genAuthData());

  return axios.delete(url, { params: params });
};

/* obter checklists */
export const getCardChecklistData = (cardID) => {
  const url = `https://api.trello.com/1/cards/${cardID}/checklists`;

  let params = Object.assign({}, genAuthData(), {
    checkItems: 'all',
    checkItem_fields: 'name,pos,state',
  });

  return axios.get(url, { params: params });
};

/* atualizar item do checklist */
export const updateCardChecklistItem = (cardID, checkItemID, opts) => {
  const url = `https://api.trello.com/1/cards/${cardID}/checkItem/${checkItemID}`;
  let params = Object.assign({}, genAuthData(), opts);
  return axios.put(url, params);
};

/* remover item do checklist */
export const deleteCardChecklistItem = (checklistID, checkItemID) => {
  const url = `https://api.trello.com/1/checklists/${checklistID}/checkItems/${checkItemID}`;
  let params = Object.assign({}, genAuthData());
  return axios.delete(url, { params: params });
};

/* adicionar item ao checklist */
export const createCardChecklistItem = (checklistID, opts) => {
  const url = `https://api.trello.com/1/checklists/${checklistID}/checkItems`;
  let params = Object.assign({}, genAuthData(), opts);
  return axios.post(url, params);
};

/* cria uma checklist */
export const createCardChecklist = (cardID, checklistName) => {
  const url = `https://api.trello.com/1/checklists`;
  let params = Object.assign({}, genAuthData(), { idCard: cardID, name: checklistName });
  return axios.post(url, params);
};
