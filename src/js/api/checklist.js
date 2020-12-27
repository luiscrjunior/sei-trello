import axios from 'axios';
import auth from './auth.js';

/* obter checklists */
export const getCardChecklistData = (cardID) => {
  const url = `https://api.trello.com/1/cards/${cardID}/checklists`;

  let params = Object.assign({}, auth.getCredentials(), {
    checkItems: 'all',
    checkItem_fields: 'name,pos,state',
  });

  return axios.get(url, { params: params });
};

/* cria uma checklist */
export const createCardChecklist = (cardID, checklistName) => {
  const url = `https://api.trello.com/1/checklists`;
  let params = Object.assign({}, auth.getCredentials(), { idCard: cardID, name: checklistName });
  return axios.post(url, params);
};

/* adicionar item ao checklist */
export const createCardChecklistItem = (checklistID, opts) => {
  const url = `https://api.trello.com/1/checklists/${checklistID}/checkItems`;
  let params = Object.assign({}, auth.getCredentials(), opts);
  return axios.post(url, params);
};

/* atualizar item do checklist */
export const updateCardChecklistItem = (cardID, checkItemID, opts) => {
  const url = `https://api.trello.com/1/cards/${cardID}/checkItem/${checkItemID}`;
  let params = Object.assign({}, auth.getCredentials(), opts);
  return axios.put(url, params);
};

/* remover item do checklist */
export const deleteCardChecklistItem = (checklistID, checkItemID) => {
  const url = `https://api.trello.com/1/checklists/${checklistID}/checkItems/${checkItemID}`;
  let params = Object.assign({}, auth.getCredentials());
  return axios.delete(url, { params: params });
};

/* remover uma checklist */
export const deleteCardChecklist = (checklistID) => {
  const url = `https://api.trello.com/1/checklists/${checklistID}`;
  let params = Object.assign({}, auth.getCredentials());
  return axios.delete(url, { params: params });
};
