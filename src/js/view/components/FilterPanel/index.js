import React from 'react';
import styles from './styles.scss';
import classNames from 'classnames';
import FloatingPanel from 'view/components/FloatingPanel';
import CheckboxList from 'view/components/CheckboxList';

const defaultOptions = {
  location: [],
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
  processes: [
    {
      key: 'WITHOUT_CARD',
      label: 'Processos sem cartão',
    },
  ],
};

const defaultFilter = {
  location: null,
  labels: null,
  due: null,
};

class FilterPanel extends React.Component {

  constructor (props) {
    super(props);
    this.state = { options: Object.assign({}, defaultOptions) };
    this.state.options.labels = this.updateLabels(props.currentLabels);
    this.state.options.locations = this.updateLocations(props.currentLocations);
  }

  updateLabels (currentLabels) {
    if (!currentLabels) currentLabels = [];
    return defaultOptions.labels.concat(currentLabels.map((newLabel) => {
      return {
        key: newLabel,
        label: newLabel.label,
      };
    }));
  }

  updateLocations (updateLocations) {
    if (!updateLocations) updateLocations = [];
    let newLocations = updateLocations.map((newLocation) => {
      return {
        key: newLocation,
        label: newLocation.board.name + ' » ' + newLocation.list.name,
      };
    });
    newLocations.sort((a, b) => {
      const label1 = a.label.toUpperCase();
      const label2 = b.label.toUpperCase();
      return (label1 < label2) ? -1 : (label1 > label2) ? 1 : 0;
    });
    return newLocations;
  };

  componentWillReceiveProps (nextProps) {
    let currentOptions = Object.assign({}, this.state.options);
    currentOptions.labels = this.updateLabels(nextProps.currentLabels);
    currentOptions.locations = this.updateLocations(nextProps.currentLocations);
    this.setState({ options: currentOptions });
  }

  onFilterChange (type, checked, key) {
    if (!this.props.onFilterChange) return;
    this.props.onFilterChange(type, checked, key);
  }

  onClose () {
    if (!this.props.onClose) return;
    this.props.onClose();
  }

  render () {

    const filter = this.props.filter || defaultFilter;

    return (
      <FloatingPanel
        title="Filtros"
        className={this.props.className}
        onClose={this.onClose.bind(this)}>
        <CheckboxList
          selected={filter.locations}
          options={this.state.options.locations}
          onClick={(checked, key) => this.onFilterChange('locations', checked, key)} />        
        <hr />
        <CheckboxList
          color={true}
          selected={filter.labels}
          options={this.state.options.labels}
          onClick={(checked, key) => this.onFilterChange('labels', checked, key)} />
        <hr />
        <CheckboxList
          selected={filter.due}
          options={this.state.options.due}
          onClick={(checked, key) => this.onFilterChange('due', checked, key)} />
        <hr />
        <CheckboxList
          selected={filter.processes}
          options={this.state.options.processes}
          onClick={(checked, key) => this.onFilterChange('processes', checked, key)} />
      </FloatingPanel>
    );
  }
};

export default FilterPanel;
