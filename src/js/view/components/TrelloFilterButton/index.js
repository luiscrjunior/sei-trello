import React from 'react';
import TrelloButton from 'view/components/TrelloButton';
import styles from './styles.scss';
import classNames from 'classnames';

class TrelloFilterButton extends React.Component {

  onClick (e) {
    e.preventDefault();
    if (!this.props.onClick) return;
    if (this.props.isLoading) return;
    this.props.onClick(e);
  }

  render () {
    return (
      <TrelloButton 
        title="Filtrar"
        icon="fas fa-filter" 
        onClick={this.onClick.bind(this)}>

      </TrelloButton>
    );
  }
};

export default TrelloFilterButton;
