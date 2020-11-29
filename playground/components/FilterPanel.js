import React from 'react';
import FilterPanel from 'view/components/FilterPanel';

const filter = {
  process: 'WITH_TRELLO_CARD',
  labels: ['NO_LABEL', 'LABEL_YELLOW'],
  due: 'WITH_INCOMPLETE_DUE',
};

const labels = [
  {
    color: 'red',
    label: 'urgente',
  },
  {
    color: 'yellow',
    label: 'importante',
  },
];

// /*setTimeout(() => {
//   render([
//     {
//       color: 'yellow',
//       label: 'importante',
//     },
//   ], {
//     'process': null,
//     'labels': null,
//     'due': null,
//   });
// }, 1000);
// */

const FilterPanelPlayground = () => {
  return <FilterPanel currentLabels={labels} filter={filter}></FilterPanel>;
};

export default FilterPanelPlayground;
