import React from 'react';
import styles from './styles.scss';
import classNames from 'classnames';

class FloatingPanel extends React.Component {

  onClose (e) {
    e.preventDefault();
    if (!this.props.onClose) return;
    this.props.onClose();
  }

  render () {
    return (
      <div className={classNames(styles.panel, this.props.className)}>
        <span className={styles.title}>{this.props.title}</span>
        <a href="#" className={styles['btn-close']} onClick={this.onClose.bind(this)}>&times;</a>
        <div className={styles.content}>{this.props.children}</div>
      </div>
    );
  }
};

export default FloatingPanel;
