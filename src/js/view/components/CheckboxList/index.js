import React from 'react';
import styles from './styles.scss';
import classNames from 'classnames';
import { isEqual, isArray } from 'lodash';

class CheckboxList extends React.Component {

  handleClick (isSelected, item, e) {
    e.preventDefault();
    if (!this.props.onClick) return;
    this.props.onClick(!isSelected, item);
  }

  isSelected (key) {
    if (!this.props.selected) {
      return false;
    } else if (typeof this.props.selected === 'string') {
      return (key === this.props.selected);
    } else if (isArray(this.props.selected)) {
      return this.props.selected.some((itemInSelection) => isEqual(itemInSelection, key));
    } else {
      return false;
    }
  }

  renderItems () {
    if (!this.props.options) return null;
    return this.props.options.map((item, idx) => {
      const isSelected = this.isSelected(item.key);
      const colorStyle = (typeof item.key === 'object' && 'color' in item.key) ? 'color-block-' + item.key.color.toLowerCase() : null;
      return (
        <li key={idx} className={classNames(styles.item, { [styles.selected]: isSelected })}>
          <a href="#" className={styles.anchor} onClick={this.handleClick.bind(this, isSelected, item.key)}>
            <span className={classNames(styles['color-block'], styles[colorStyle], { hide: !this.props.color })}></span>
            <span className={styles.label}>{item.label}</span>
            <i className={classNames('fas fa-check', styles['ic-check'])}></i>
          </a>
        </li>
      );
    });
  }

  render () {
    return (
      <ul className={styles.list}>
        {this.renderItems()}
      </ul>
    );
  }
};

export default CheckboxList;
