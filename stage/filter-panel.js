import React from 'react';
import ReactDOM from 'react-dom';

import FilterPanel from 'view/components/FilterPanel';

const placeholder = document.querySelector('#app');

const currentFilter = {
  'locations': null,
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

const currentLocations = [
  {
    board: {
      name: 'SEI',
    },
    list: {
      name: 'Pendentes',
    },
  },
];

const render = (labels, locations, filter) => {
  ReactDOM.render(
    <FilterPanel
      currentLabels={labels}
      currentLocations={locations}
      filter={filter}></FilterPanel>,
    placeholder
  );
};

render(currentLabels, currentLocations, currentFilter);

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