import React from 'react';
import styles from './styles.scss';
import classNames from 'classnames';

class FilterMessage extends React.Component {

  render () {
    return (
      <span className={classNames(styles.message, { hide: !this.props.show })}>filtro ligado</span>
    );
  }
};

export default FilterMessage;
