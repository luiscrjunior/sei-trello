import * as dom from './dom.js';
import * as controller from 'controller/trello.js';

dom.prepare();

const processNumber = document
  .querySelector('.trello-process-box')
  .getAttribute('data-trello-process-number');

controller.load({ processNumber: processNumber });
