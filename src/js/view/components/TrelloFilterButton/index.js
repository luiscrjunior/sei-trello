import React from 'react';
import TrelloButton from 'view/components/TrelloButton';
import FilterPanel from 'view/components/FilterPanel';
import styles from './styles.scss';
import classNames from 'classnames';

class TrelloFilterButton extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  onClick (e) {
    e.preventDefault();
    this.setState({ isOpen: !this.state.isOpen });
  }

  onPanelClose (e) {
    this.setState({ isOpen: false });
  }

  render () {
    return (
      <div className={styles.wrapper}>
        <TrelloButton
          title="Filtrar"
          icon="fas fa-filter"
          onClick={this.onClick.bind(this)}>
        </TrelloButton>
        <FilterPanel
          className={classNames(styles['filter-panel'], { hide: !this.state.isOpen }) }
          filter={{process: null, labels: null, due: null}}
          onClose={this.onPanelClose.bind(this)}
          onClick={this.onClick.bind(this)}> ></FilterPanel>  
      </div>
    );
  }
};

export default TrelloFilterButton;
