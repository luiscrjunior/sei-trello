import React from 'react';
import ReactDOM from 'react-dom';

import FilterPanel from 'view/components/FilterPanel';

const placeholder = document.querySelector('#app');

const currentFilter = {
  'process': 'WITH_TRELLO_CARD',
  'labels': ['NO_LABEL', 'LABEL_YELLOW'],
  'due': 'WITH_INCOMPLETE_DUE',
};

const currentLabels = [
  {
    color: 'red',
    label: 'urgente',
  },
  {
    color: 'yellow',
    label: 'importante',
  },
];

const render = (labels, filter) => {
  ReactDOM.render(
    <FilterPanel
      currentLabels={labels}
      filter={filter}></FilterPanel>,
    placeholder
  );
};

render(currentLabels, currentFilter);

/*setTimeout(() => {
  render([
    {
      color: 'yellow',
      label: 'importante',
    },
  ], {
    'process': null,
    'labels': null,
    'due': null,
  });
}, 1000);
*/