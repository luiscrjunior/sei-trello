import React from 'react';
import TrelloButton from 'view/components/TrelloButton';
import FilterPanel from 'view/components/FilterPanel';
import styles from './styles.scss';
import classNames from 'classnames';

class TrelloFilterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  onClick(e) {
    e.preventDefault();
    this.setState({ isOpen: !this.state.isOpen });
  }

  onPanelClose() {
    this.setState({ isOpen: false });
  }

  onFilterChange(type, checked, key) {
    if (!this.props.onFilterChange) return;
    this.props.onFilterChange(type, checked, key);
  }

  render() {
    return (
      <div className={classNames(styles.wrapper, 'btn-panel-trigger')}>
        <TrelloButton title="Filtrar" icon="fas fa-filter" onClick={this.onClick.bind(this)}></TrelloButton>

        {this.props.hasFilter && <span className={styles['filter-message']}>ligado</span>}

        <FilterPanel
          className={classNames(styles['filter-panel'], { hide: !this.state.isOpen })}
          currentLabels={this.props.currentLabels}
          currentLocations={this.props.currentLocations}
          onClose={this.onPanelClose.bind(this)}
          filter={this.props.filter}
          onFilterChange={this.onFilterChange.bind(this)}
        ></FilterPanel>
      </div>
    );
  }
}

export default TrelloFilterButton;
