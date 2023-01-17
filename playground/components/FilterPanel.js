import React from 'react';
import FilterPanel from 'view/components/FilterPanel';
import styled from 'styled-components';

const Content = styled.div`
  left: -200px;
  top: -300px;
  position: relative;
`;

const filter = {
  process: 'WITH_TRELLO_CARD',
  labels: ['NO_LABEL'],
  due: 'WITH_INCOMPLETE_DUE',
};

const labels = [
  {
    color: 'red',
    name: 'urgente',
  },
  {
    color: 'yellow',
    name: 'importante',
  },
];

const FilterPanelPlayground = () => {
  return (
    <Content>
      <FilterPanel currentLabels={labels} filter={filter}></FilterPanel>
    </Content>
  );
};

export default FilterPanelPlayground;
