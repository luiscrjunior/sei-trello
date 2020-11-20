import React from 'react';
import TrelloButton from 'view/components/TrelloButton';
import loadingImg from './loading.svg';
import styles from './styles.scss';
import classNames from 'classnames';

class TrelloRefreshButton extends React.Component {
  onClick(e) {
    e.preventDefault();
    if (!this.props.onClick) return;
    if (this.props.isLoading) return;
    this.props.onClick(e);
  }

  render() {
    return (
      <TrelloButton title="Atualizar cartões do Trello" icon="fas fa-sync-alt" onClick={this.onClick.bind(this)}>
        <img src={loadingImg} className={classNames(styles.loadingImg, { hide: !this.props.isLoading })} />
      </TrelloButton>
    );
  }
}

export default TrelloRefreshButton;
