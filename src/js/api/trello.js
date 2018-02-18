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
export const getAllBoards = () => {

  const url = 'https://api.trello.com/1/member/me/boards';

  return axios.get(url, {
    params: Object.assign({}, genAuthData(), {
      board_fields: 'name,id',
    }),
  });

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

export const searchCards = (cardID) => {

  const url = 'https://api.trello.com/1/search';

  let params = Object.assign({}, genAuthData(), {
    query: 'description:"SEI" is:open',
    modelTypes: 'cards',
    card_fields: 'name,desc,labels,id,idBoard,idList,due,dueComplete,shortUrl',
    cards_limit: '1000',
  });

  if (typeof cardID !== 'undefined') {
    params['idCards'] = cardID;
  }

  return axios.get(url, { params: params });

};

export const createCard = (opts) => {

  const url = 'https://api.trello.com/1/cards';

  let params = Object.assign({}, genAuthData(), {
    name: opts.name,
    desc: opts.desc,
    pos: 'bottom',
    idList: opts.listID,
  });

  return axios.post(url, params);

};
