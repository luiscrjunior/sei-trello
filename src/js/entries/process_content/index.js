import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as dom from './dom.js';
import * as controller from 'controller/trello.js';

import 'css/process_content.scss';

dom.prepare();

const firstTrelloBox = document.querySelector('[data-trello-process-box]');

if (firstTrelloBox) {
  const processNumber = firstTrelloBox.getAttribute('data-trello-process-number');
  if (processNumber) {
    controller.load({ processNumber: processNumber });
  }
}
