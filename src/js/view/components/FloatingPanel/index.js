import React from 'react';
import styles from './styles.scss';
import classNames from 'classnames';

class FloatingPanel extends React.Component {

  render () {
    return (
      <div className={styles.panel}>
        <span className={styles.title}>{this.props.title}</span>
        <a href="#" className={styles['btn-close']}>&times;</a>
        <div className={styles.content}>{this.props.children}</div>
      </div>
    );
  }
};

export default FloatingPanel;
