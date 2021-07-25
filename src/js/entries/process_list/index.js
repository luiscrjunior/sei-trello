import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as dom from './dom.js';
import * as controller from 'controller/trello.js';

import 'css/process_list.scss';

dom.prepare();

controller.load();
