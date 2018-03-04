import React from 'react';
import buttonBG from './add-card-icon.png';
import loadingImg from './loading.svg';
import styles from './styles.scss';
import classNames from 'classnames';

class AddTrelloCardButton extends React.Component {

  onClick (e) {
    if (!this.props.onClick) return;
    this.props.onClick(this.props.processNumber);
    e.preventDefault();
  }

  render () {
    return (
      <a href='#' onClick={this.onClick.bind(this)} className={styles.button} >
        <img title='Criar cartão relacionado a este processo' src={buttonBG} className={classNames(styles.buttonBG, { hide: this.props.isAdding })} />
        <img src={loadingImg} className={classNames(styles.loadingImg, { hide: !this.props.isAdding })} />
      </a>
    );
  }
};

export default AddTrelloCardButton;
