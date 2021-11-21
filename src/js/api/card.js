import axios from 'axios';
import auth from './auth.js';

export const searchCards = (processNumber) => {
  const url = 'https://api.trello.com/1/search';

  let description = 'SEI ';

  if (processNumber) description += processNumber;

  let params = Object.assign({}, auth.getCredentials(), {
    query: `description:${description} is:open`,
    modelTypes: 'cards',
    card_fields: 'name,desc,labels,id,due,dueComplete,shortUrl,idChecklists',
    cards_limit: '1000',
    card_board: 'true',
    card_list: 'true',
  });

  return axios.get(url, { params: params });
};

export const searchBoardCards = (trelloBoard) => {
  const url = `https://api.trello.com/1/boards/${trelloBoard.id}/lists`;

  let params = Object.assign({}, auth.getCredentials(), {
    cards: 'open',
    filter: 'open',
    card_fields: 'name,desc,labels,id,due,dueComplete,shortUrl,idChecklists',
  });

  return axios.get(url, { params: params });
};

export const getCardData = (cardID) => {
  const url = 'https://api.trello.com/1/cards/' + cardID;

  let params = Object.assign({}, auth.getCredentials(), {
    fields: 'name,desc,labels,id,due,dueComplete,shortUrl,idChecklists',
    board: 'true',
    list: 'true',
  });

  return axios.get(url, { params: params });
};

export const createCard = (opts) => {
  const url = 'https://api.trello.com/1/cards';

  let params = Object.assign({}, auth.getCredentials(), {
    name: opts.name,
    desc: opts.desc,
    pos: 'bottom',
    idList: opts.defaultList.id,
  });

  return axios.post(url, params);
};

export const updateCard = (cardID, opts) => {
  const url = 'https://api.trello.com/1/cards/' + cardID;

  let params = Object.assign({}, auth.getCredentials(), opts);

  return axios.put(url, params);
};

export const deleteCard = (cardID) => {
  const url = 'https://api.trello.com/1/cards/' + cardID;

  let params = Object.assign({}, auth.getCredentials());

  return axios.delete(url, { params: params });
};
