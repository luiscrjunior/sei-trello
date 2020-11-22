import React from 'react';
import ReactDOM from 'react-dom';

import ChecklistPanel from 'view/components/ChecklistPanel';

if (module.hot) module.hot.accept();

const placeholder = document.querySelector('#app');

const render = () => {
  ReactDOM.render(<ChecklistPanel />, placeholder);
};

render();
