import * as dom from './dom.js';
import * as targets from './targets.js';
import * as controller from 'controller/trello.js';

dom.addTrelloButtonPlaceHolder();
dom.addTrelloCardPlaceHolders();

const pageTargets = targets.map();

controller.load({
  targets: pageTargets,
});
