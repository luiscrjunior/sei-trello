import * as ui from 'view/ui.js';
import * as api from 'api/trello.js';
import * as store from 'model/store.js';
import * as handler from 'model/handler.js';
import * as alert from 'view/alert.js';

const DEFAULT_SYNC_ERROR_MSG = 'Erro ao sincronizar com o Trello. Verifique se as credenciais informadas nas opções estão corretas. Caso positivo, tente novamente mais tarde, pois os servidores podem estar fora do ar. Se o problema persistir, entre em contato com o administrador da extensão.';

store.onDataChanged(() => {
  ui.renderAll();
});

const updateBoards = () => {
  return new Promise((resolve, reject) => {
    api.getAllBoards()
      .then((response) => {
        store.setBoards(handler.getBoards(response.data));
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateLists = () => {
  return new Promise((resolve, reject) => {
    const boards = store.getData().boards;
    const promises = boards.map((board) => {
      return api.getListsFromBoard(board.id);
    });
    Promise.all(promises)
      .then((response) => {
        const allBoardsWithList = response.map((responseObject) => responseObject.data);
        store.setLists(handler.getLists(allBoardsWithList));
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });

};

const updateCards = () => {
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

const updateCardsWithID = (cardID) => {
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

const createCard = (options) => {
  return new Promise((resolve, reject) => {
    api.createCard(options)
      .then((response) => {
        store.addCards(handler.getCards([response.data]));
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateCardData = (cardID) => {
  const cardsToUpdate = Object.assign({}, store.getData()).cards;
  cardsToUpdate
    .filter((card) => card.cardID === cardID)
    .forEach((card) => { card.isLoading = true; });
  store.setCards(cardsToUpdate);
  updateCardsWithID(cardID)
    .catch((error) => {
      store.setIsLoading(false);
      console.log(error);
      alert.error(DEFAULT_SYNC_ERROR_MSG);
    });
};

export const updateAllData = () => {
  store.setIsLoading(true);
  updateBoards()
    .then(() => updateLists())
    .then(() => updateCards())
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

export const addCardFor = (processNumber, placeholder) => {
  const isAdding = store.getData().isAddingCardFor;
  if (isAdding) return;
  store.setIsAddingFor(processNumber);
  let options = handler.extractRelevantInfoFromRow(processNumber, placeholder.tableRow);
  chrome.storage.sync.get({
    defaultBoard: '',
    defaultList: '',
  }, (items) => {

    const listToAdd = store.getList(items.defaultBoard, items.defaultList);
    if (!listToAdd) {
      alert.error('Não foi possível encontrar o quadro e a lista padrão para criar o novo cartão. Por favor, verifique se você preencheu corretamente estes dados nas opções.');
      store.setIsAddingFor(null);
      return;
    }

    options.listID = listToAdd.id;

    createCard(options)
      .then(() => {
        store.setIsAddingFor(null);
      })
      .catch((error) => {
        store.setIsAddingFor(null);
        console.log(error);
        alert.error(DEFAULT_SYNC_ERROR_MSG);
      });

  });

};
