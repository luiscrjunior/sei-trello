import axios from 'axios';
import auth from './auth.js';

export const searchBoardsByName = (boardName) => {
  const url = 'https://api.trello.com/1/search';

  let params = Object.assign({}, auth.getCredentials(), {
    query: `name:"${boardName}" is:open`,
    modelTypes: 'boards',
    board_fields: 'name',
    boards_limit: '1000',
  });

  return axios.get(url, { params: params });
};

export const searchAllBoards = () => {
  const url = 'https://api.trello.com/1/search';

  let params = Object.assign({}, auth.getCredentials(), {
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
    params: Object.assign({}, auth.getCredentials(), {
      lists: 'open',
      list_fields: 'id,name',
    }),
  });
};
