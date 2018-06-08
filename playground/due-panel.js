import React from 'react'; 
import ReactDOM from 'react-dom'; 

import DuePanel from 'view/components/DuePanel';

if (module.hot) module.hot.accept();

const placeholder = document.querySelector('#app');

const render = () => { 
  ReactDOM.render(
    <DuePanel />,
    placeholder
  );
};

render();
