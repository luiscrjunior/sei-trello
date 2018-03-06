import React from 'react';
import styles from './styles.scss';
import classNames from 'classnames';

class CheckboxList extends React.Component {

  handleClick (isSelected, key, e) {
    e.preventDefault();
    if (!this.props.onClick) return;
    this.props.onClick(!isSelected, key);
  }

  isSelected (key) {
    if (!this.props.selected) {
      return false;
    } else if (typeof this.props.selected === 'string') {
      return (key === this.props.selected);
    } else if (typeof this.props.selected === 'object') {
      return (this.props.selected.indexOf(key) > -1);
    } else {
      return false;
    }
  }

  renderItems () {
    if (!this.props.options) return null;
    return this.props.options.map((item) => {
      const isSelected = this.isSelected(item.key);
      const colorStyle = item.key.replace('LABEL_', 'color-block-').toLowerCase();
      return (
        <li key={item.key} className={classNames(styles.item, { [styles.selected]: isSelected })}>
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
