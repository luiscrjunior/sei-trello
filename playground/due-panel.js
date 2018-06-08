import React from 'react';
import ReactDOM from 'react-dom';

import DuePanel from 'view/components/DuePanel';

const placeholder = document.querySelector('#app');

const render = () => {
  ReactDOM.render(
    <DuePanel />,
    placeholder
  );
};

render();
