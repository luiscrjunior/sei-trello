import React from 'react';
import buttonBG from './trello-icon.jpg';
import styles from './styles.scss';

import { TrelloIcon } from './styles.js';

class TrelloButton extends React.Component {
  onClick(e) {
    e.preventDefault();
    if (!this.props.onClick) return;
    this.props.onClick(e);
  }

  render() {
    return (
      <a href="#" title={this.props.title} onClick={this.onClick.bind(this)} className={styles.button}>
        <img src={buttonBG} className={styles.buttonBG} />
        <div className={styles['icon-holder']}>
          <TrelloIcon icon={this.props.icon} />
        </div>
        {this.props.children}
      </a>
    );
  }
}

export default TrelloButton;
