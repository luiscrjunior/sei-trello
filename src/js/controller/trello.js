import * as ui from 'view/ui.js';
import * as api from 'api/trello.js';
import * as store from 'model/store.js';
import * as handler from 'model/handler.js';
import * as alert from 'view/alert.js';

const DEFAULT_SYNC_ERROR_MSG = 'Erro ao sincronizar com o Trello. Verifique se as credenciais informadas nas opções estão corretas. Caso positivo, tente novamente mais tarde, pois os servidores podem estar fora do ar. Se o problema persistir, entre em contato com o administrador da extensão.';

store.onDataChanged(() => {
  ui.renderAll();
});

const doUpdateCards = () => {
  return new Promise((resolve, reject) => {
    api.searchCards()
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
    api.searchCards(cardID)
      .then((response) => {
        store.updateCardsWithID(cardID, handler.getCards(response.data.cards));
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const doCreateCard = (options) => {
  return new Promise((resolve, reject) => {
    api.createCard(options)
      .then((response) => {
        store.addCards(handler
          .getCards([response.data])
          .map((card) => {
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

export const refreshCardData = (cardID) => {
  const cardsToUpdate = Object.assign({}, store.getData()).cards;
  cardsToUpdate
    .filter((card) => card.cardID === cardID)
    .forEach((card) => { card.isLoading = true; });
  store.setCards(cardsToUpdate);
  doRefreshCardsWithID(cardID)
    .catch((error) => {
      store.setIsLoading(false);
      console.log(error);
      alert.error(DEFAULT_SYNC_ERROR_MSG);
    });
};

export const updateCardData = (cardID, newData) => {
  const cardsToUpdate = Object.assign({}, store.getData()).cards;
  cardsToUpdate
    .filter((card) => card.cardID === cardID)
    .forEach((card) => {
      card.isLoading = true;
      card = Object.assign(card, newData);
    });
  store.setCards(cardsToUpdate);
  api.updateCard(cardID, newData)
    .then((response) => {
      doRefreshCardsWithID(cardID)
        .catch((error) => {
          store.setIsLoading(false);
          console.log(error);
          alert.error(DEFAULT_SYNC_ERROR_MSG);
        });
    });
};

export const updateAllData = () => {
  store.setIsLoading(true);
  doUpdateCards()
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

const getDefaultBoardAndList = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get({
      defaultBoard: '',
      defaultList: '',
    }, (items) => {
      if (!items.defaultBoard || !items.defaultList) reject(new Error());
      api.searchBoardsByName(items.defaultBoard)
        .then((response) => {
          if ('data' in response && 'boards' in response.data && response.data.boards.length > 0) {
            const defaultBoard = response.data.boards[0];
            api.getListsFromBoard(defaultBoard.id)
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
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
};

export const addCardFor = (processNumber, placeholder) => {
  const isAdding = store.getData().isAddingCardFor;
  const isLoading = store.getData().isLoading;
  if (isAdding || isLoading) return;
  store.setIsAddingFor(processNumber);
  let options = handler.extractRelevantInfoFromRow(processNumber, placeholder.tableRow);

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
      alert.error('Ocorreu um erro ao adicionar o cartão. Verifique se você preencheu corretamente os dados do quadro e da lista padrão nas opções.');
    });
};
