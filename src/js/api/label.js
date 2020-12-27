import axios from 'axios';
import auth from './auth.js';

/* obter labels de um quadro */
export const getBoardLabels = (boardID) => {
  const url = `https://api.trello.com/1/boards/${boardID}/labels`;

  let params = Object.assign({}, auth.getCredentials(), {
    limit: 1000,
  });

  return axios.get(url, { params: params });
};

/* adicionar label a um cartão  */
export const addLabelToCard = (cardID, labelID) => {
  const url = `https://api.trello.com/1/cards/${cardID}/idLabels`;
  let params = Object.assign({}, auth.getCredentials(), {
    value: labelID,
  });
  return axios.post(url, params);
};

/* remover um label de um cartão  */
export const removeLabelFromCard = (cardID, labelID) => {
  const url = `https://api.trello.com/1/cards/${cardID}/idLabels/${labelID}`;
  let params = Object.assign({}, auth.getCredentials());
  return axios.delete(url, { params: params });
};

/* criar um label vinculado a um quadro  */
export const createLabel = (boardID, opts) => {
  if (opts.color === null) opts.color = 'null';
  const url = `https://api.trello.com/1/labels`;
  let params = Object.assign({}, auth.getCredentials(), {
    idBoard: boardID,
    name: opts.name,
    color: opts.color,
  });
  return axios.post(url, params);
};

/* editar um label */
export const updateLabel = (labelID, opts) => {
  if (opts.color === null) opts.color = 'null';
  const url = `https://api.trello.com/1/labels/${labelID}`;
  let params = Object.assign({}, auth.getCredentials(), opts);
  return axios.put(url, params);
};

/* deletar um label */
export const deleteLabel = (labelID) => {
  const url = `https://api.trello.com/1/labels/${labelID}`;
  let params = Object.assign({}, auth.getCredentials());
  return axios.delete(url, { params: params });
};
