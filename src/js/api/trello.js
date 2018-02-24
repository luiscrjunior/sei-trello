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
    card_board: 'true',
    card_list: 'true',
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
    idList: opts.defaultList.id,
  });

  return axios.post(url, params);

};
