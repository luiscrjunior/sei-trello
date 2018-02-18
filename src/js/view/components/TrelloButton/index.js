import React from 'react';
import buttonBG from './trello-icon.jpg';
import loadingImg from './loading.svg';
import styles from './styles.scss';
import classNames from 'classnames';

class TrelloButton extends React.Component {

  onClick (e) {
    if (!this.props.onClick) return;
    if (this.props.isLoading) return;
    this.props.onClick(e);
    e.preventDefault();
  }

  render () {
    return (
      <a href='#' onClick={this.onClick.bind(this)} className={styles.button} >
        <img title='Atualizar cartões do Trello' src={buttonBG} className={styles.buttonBG} />
        <img src={loadingImg} className={classNames(styles.loadingImg, { hide: !this.props.isLoading })} />
      </a>
    );
  }
};

export default TrelloButton;
