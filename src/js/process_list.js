import * as sei from 'view/utils/sei.js';
import * as trelloApi from 'api/trello.js';
import * as trelloController from 'controller/trello.js';
import * as ui from 'view/ui.js';

chrome.storage.sync.get({
  appKey: '',
  appToken: '',
}, (items) => {

  trelloApi.setKeys(items.appKey, items.appToken);

  /* start app */
  bootstrap();

});

const bootstrap = () => {

  sei.addTrelloButtonPlaceHolder();
  sei.addAddTrelloCardPlaceHolders();

  ui.mapAllPlaceholders();

  /* render initial state */
  ui.renderAll();

  /* trigger initial update */
  trelloController.refreshAllCards();

};
