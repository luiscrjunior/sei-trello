import { merge, isEqual } from 'lodash';

import * as api from 'api/trello.js';
import * as store from 'model/store.js';
import * as handler from 'model/handler.js';
import * as alert from 'view/alert.js';

const DEFAULT_SYNC_ERROR_MSG = `Erro ao sincronizar com o Trello. Verifique se as credenciais informadas nas <a href="#" class="btn-open-extension-option">opções</a> estão corretas. Caso positivo, tente novamente mais tarde, pois os servidores podem estar fora do ar. Se o problema persistir, entre em contato com o administrador da extensão.`;

const doRefreshCards = (processNumber) => {
  return new Promise((resolve, reject) => {
    api
      .searchCards(processNumber)
      .then((response) => {
        store.setCards(handler.getCards(response.data.cards));
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const doRefreshCardsWithID = (cardID) => {
  return new Promise((resolve, reject) => {
    api
      .getCardData(cardID)
      .then((response) => {
        store.updateCardsWithID(cardID, handler.getCards([response.data]));
        resolve();
      })
      .catch((error) => {
        if (error.response.status === 404) {
          /* cartão não existe mais, removê-lo da lista */
          store.updateCardsWithID(cardID, []);
          resolve();
        } else {
          reject(error);
        }
      });
  });
};

const doCreateCard = (options) => {
  return new Promise((resolve, reject) => {
    api
      .createCard(options)
      .then((response) => {
        store.addCards(
          handler.getCards([response.data]).map((card) => {
            card.location.list = options.defaultList;
            card.location.board = options.defaultBoard;
            return card;
          })
        );
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getDefaultBoardAndList = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(
      {
        defaultBoard: '',
        defaultList: '',
      },
      (items) => {
        if (!items.defaultBoard || !items.defaultList) reject(new Error());
        api
          .searchBoardsByName(items.defaultBoard)
          .then((response) => {
            if ('data' in response && 'boards' in response.data && response.data.boards.length > 0) {
              const defaultBoard = response.data.boards.find((board) => board.name === items.defaultBoard);
              if (defaultBoard) {
                api
                  .getListsFromBoard(defaultBoard.id)
                  .then((response) => {
                    const defaultList = response.data.lists.find((list) => list.name === items.defaultList);
                    if (defaultList) {
                      resolve({
                        defaultBoard: defaultBoard,
                        defaultList: defaultList,
                      });
                    } else {
                      reject(new Error('lista padrão não encontrada'));
                    }
                  })
                  .catch((error) => {
                    reject(error);
                  });
              } else {
                reject(new Error('quadro padrão não encontrado'));
              }
            } else {
              reject(new Error('quadro padrão não encontrado'));
            }
          })
          .catch((error) => {
            reject(error);
          });
      }
    );
  });
};

export const refreshCardData = (cardID) => {
  store.updateCardsData(cardID, { isLoading: true });
  doRefreshCardsWithID(cardID).catch((error) => {
    store.setIsLoading(false);
    console.log(error);
    alert.error(DEFAULT_SYNC_ERROR_MSG);
  });
};

export const refreshCards = (processNumber) => {
  store.setIsLoading(true);
  doRefreshCards(processNumber)
    .then(() => {
      store.setIsLoading(false);
    })
    .catch((error) => {
      store.setIsLoading(false);
      console.log(error);
      alert.error(DEFAULT_SYNC_ERROR_MSG);
      store.resetData();
    });
};

export const updateCardData = (cardID, newCardData) => {
  Object.assign(newCardData, { isLoading: true });
  store.updateCardsData(cardID, newCardData);

  const trelloData = {};

  /* adicionar os processos na descrição nova */
  if ('description' in newCardData) {
    trelloData['desc'] = store
      .getAllProcesssFromCardID(cardID)
      .map((processNumber) => 'SEI ' + processNumber)
      .join('\n')
      .concat('\n' + newCardData['description']);
  }

  if ('name' in newCardData) trelloData['name'] = newCardData['name'];
  if ('due' in newCardData) trelloData['due'] = newCardData['due'] === null ? 'null' : newCardData['due'];
  if ('dueComplete' in newCardData) trelloData['dueComplete'] = newCardData['dueComplete'];

  if ('list' in newCardData) trelloData['idList'] = newCardData['list'].id;

  if ('board' in newCardData) trelloData['idBoard'] = newCardData['board'].id;

  api
    .updateCard(cardID, trelloData)
    .then(() => doRefreshCardsWithID(cardID))
    .catch((error) => {
      store.setIsLoading(false);
      console.log(error);
      alert.error('Erro ao atualizar o cartão.');
    });
};

export const addCardFor = (processNumber, newCardData) => {
  const isAdding = store.getData().isAddingCardFor;
  const isLoading = store.getData().isLoading;
  if (isAdding || isLoading) return;
  store.setIsAddingFor(processNumber);
  let options = {
    name: processNumber,
    desc: 'SEI ' + processNumber,
  };
  if ('name' in newCardData) options['name'] = newCardData['name'];
  if ('description' in newCardData) options['desc'] += '\n' + newCardData['description'];

  getDefaultBoardAndList()
    .then((response) => {
      options.defaultBoard = response.defaultBoard;
      options.defaultList = response.defaultList;
      doCreateCard(options)
        .then(() => {
          store.setIsAddingFor(null);
        })
        .catch((error) => {
          store.setIsAddingFor(null);
          console.log(error);
          alert.error(DEFAULT_SYNC_ERROR_MSG);
        });
    })
    .catch((error) => {
      store.setIsAddingFor(null);
      console.log(error);
      alert.error(
        'Ocorreu um erro ao adicionar o cartão. Verifique se você preencheu corretamente os dados do quadro e da lista padrão nas <a href="#" class="btn-open-extension-option">opções</a>.<br /><br /><u>Importante:</u> certifique-se de que o quadro e a lista especificados existem na sua conta, pois a extensão não os cria automaticamente.'
      );
    });
};

export const deleteCard = (cardID) => {
  store.updateCardsData(cardID, { isLoading: true });
  api
    .deleteCard(cardID)
    .then(() => doRefreshCardsWithID(cardID))
    .catch((error) => {
      store.setIsLoading(false);
      console.log(error);
      alert.error('Ocorreu um erro ao remover o cartão.');
    });
};

export const updateFilter = (type, checked, key) => {
  let filter = merge({}, store.getData().filter);

  if (type === 'due') filter.due = checked ? key : null;

  if (type === 'labels') {
    if (checked) {
      if (!filter.labels) filter.labels = [];
      filter.labels.push(key);
    } else {
      if (filter.labels) {
        filter.labels = filter.labels.filter((label) => !isEqual(label, key));
        if (filter.labels.length === 0) filter.labels = null;
      }
    }
  }

  if (type === 'locations') {
    if (checked) {
      if (!filter.locations) filter.locations = [];
      filter.locations.push(key);
    } else {
      if (filter.locations) {
        filter.locations = filter.locations.filter((location) => !isEqual(location, key));
        if (filter.locations.length === 0) filter.locations = null;
      }
    }
  }

  if (type === 'processes') filter.processes = checked ? key : null;

  store.updateFilter(filter);
};
