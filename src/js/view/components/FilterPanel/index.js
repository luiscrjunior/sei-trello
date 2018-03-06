import React from 'react';
import styles from './styles.scss';
import classNames from 'classnames';
import FloatingPanel from 'view/components/FloatingPanel';
import CheckboxList from 'view/components/CheckboxList';

const defaultOptions = {
  process: [
    {
      key: 'WITH_TRELLO_CARD',
      label: 'Processos com cartão',
    },
    {
      key: 'WITHOUT_TRELLO_CARD',
      label: 'Processos sem cartão',
    },
  ],
  labels: [
    {
      key: 'NO_LABEL',
      label: 'Sem Etiquetas',
    },
  ],
  due: [
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
};

class FilterPanel extends React.Component {

  constructor (props) {
    super(props);
    this.state = { options: Object.assign({}, defaultOptions) };
    this.state.options.labels = this.updateLabels(props.currentLabels);
  }

  updateLabels (currentLabels) {
    if (!currentLabels) currentLabels = [];
    return defaultOptions.labels.concat(currentLabels.map((newLabel) => {
      return {
        key: 'LABEL_' + newLabel.color.toUpperCase(),
        label: newLabel.label,
      };
    }));
  }

  componentWillReceiveProps (nextProps) {
    let currentOptions = Object.assign({}, this.state.options);
    currentOptions.labels = this.updateLabels(nextProps.currentLabels);
    this.setState({ options: currentOptions });
  }

  onItemClick (type, checked, key) {
    console.log(type, checked, key);
  }

  onClose () {
    if (!this.props.onClose) return;
    this.props.onClose();
  }

  render () {
    return (
      <FloatingPanel
        title="Filtros"
        className={this.props.className}
        onClose={this.onClose.bind(this)}>
        <CheckboxList
          selected={this.props.filter.process}
          options={this.state.options.process}
          onClick={(checked, key) => this.onItemClick('process', checked, key)} />
        <hr />
        <CheckboxList
          color={true}
          selected={this.props.filter.labels}
          options={this.state.options.labels}
          onClick={(checked, key) => this.onItemClick('labels', checked, key)} />
        <hr />
        <CheckboxList
          selected={this.props.filter.due}
          options={this.state.options.due}
          onClick={(checked, key) => this.onItemClick('due', checked, key)} />
      </FloatingPanel>
    );
  }
};

export default FilterPanel;
