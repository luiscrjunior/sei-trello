import React from 'react';
import classNames from 'classnames';

import styles from './styles.scss';

class Button extends React.Component {

  onClick (e) {
    if (!this.props.onClick) return;
    this.props.onClick();
    e.preventDefault();
  }

  render () {

    const buttonClass = [
      styles.button,
      styles[this.props.type || 'default'],
      this.props.className,
    ];

    return (
      <button onClick={this.onClick.bind(this)} className={classNames(buttonClass)}>{this.props.children}</button>
    );
  }
};

export default Button;
