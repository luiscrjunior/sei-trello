import React from 'react';
import ReactDOM from 'react-dom';

import DuePanel from 'view/components/DuePanel';

if (module.hot) module.hot.accept();

const placeholder = document.querySelector('#app');

const render = () => {
  ReactDOM.render(
    <DuePanel
      due="2018-06-09T14:00:00.000Z"
      dueComplete={true}
    />,
    placeholder
  );
};

render();
