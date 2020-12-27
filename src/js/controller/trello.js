import * as ui from 'view/ui.js';
import * as store from 'model/store.js';
import * as api from 'api';
import * as actions from 'actions/trello.js';

export const load = (opts) => {
  chrome.storage.sync.get(
    {
      appKey: '',
      appToken: '',
    },
    (items) => {
      api.setCredentials(items.appKey, items.appToken);

      store.onDataChanged(() => ui.render());

      if (opts && 'processNumber' in opts) {
        actions.refreshCards(opts['processNumber']);
      } else {
        actions.refreshCards();
      }
    }
  );
};
