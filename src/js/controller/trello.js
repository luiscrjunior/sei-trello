import * as ui from 'view/ui.js';
import * as api from 'api/trello.js';
import * as store from 'model/store.js';
import * as handler from 'model/handler.js';
import * as alert from 'view/alert.js';

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

export const updateCardData = (cardID) => {
  const cardsToUpdate = Object.assign({}, store.getData()).cards;
  cardsToUpdate
    .filter((card) => card.cardID === cardID)
    .forEach((card) => { card.isLoading = true; });
  store.setCards(cardsToUpdate);
  updateCardsWithID(cardID);
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
      alert.error('Erro ao sincronizar com o Trello. Verifique se as credenciais informadas nas opções estão corretas. Caso positivo, tente novamente mais tarde, pois os servidores podem estar fora do ar. Se o problema persistir, entre em contato com o administrador da extensão.');
      store.resetData();
    });
};
