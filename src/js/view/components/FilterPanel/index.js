import React from 'react';
import styles from './styles.scss';
import classNames from 'classnames';
import FloatingPanel from 'view/components/FloatingPanel';
import CheckboxList from 'view/components/CheckboxList';

const options = {
  process: {
    multiple: false,
    selection: 'NO_FILTER',
    items: [
      {
        key: 'WITH_TRELLO_CARD',
        label: 'Processos com cartão',
      },
      {
        key: 'WITHOUT_TRELLO_CARD',
        label: 'Processos sem cartão',
      },
    ],
  },
  labels: {
    multiple: true,
    selection: 'NO_FILTER',
    items: [
      {
        key: 'NO_LABEL',
        label: 'Sem Etiquetas',
      },
    ],
  },
  due: {
    multiple: false,
    selection: 'NO_FILTER',
    items: [
      {
        key: 'WITH_INCOMPLETE_DUE',
        label: 'Entrega em aberto',
      },
      {
        key: 'WITH_COMPLETE_DUE',
        label: 'Entrega concluída',
      },
      {
        key: 'WITHOUT_DUE',
        label: 'Sem data de entrega',
      },
    ],
  },
};

class FilterPanel extends React.Component {

  render () {
    return (
      <FloatingPanel title="Filtros">
        <CheckboxList options={options.process} />
        <hr />
        <CheckboxList options={options.labels} />
        <hr />
        <CheckboxList options={options.due}/>
      </FloatingPanel>
    );
  }
};

export default FilterPanel;
