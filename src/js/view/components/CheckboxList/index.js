import React from 'react';
import styles from './styles.scss';
import classNames from 'classnames';

class CheckboxList extends React.Component {

  handleClick (key, e) {
    console.log(key);
  }

  isSelected (key) {
    if (!this.props.options.selection) {
      return false;
    } else if (typeof this.props.options.selection === 'string') {
      return (key === this.props.options.selection);
    } else if (typeof this.props.options.selection === 'object') {
      return (this.props.options.selection.indexOf(key) > -1);
    } else {
      return false;
    }
  }

  renderItems () {
    if (!this.props.options) return null;
    return this.props.options.items.map((item) => (
      <li key={item.key} className={classNames(styles.item, { [styles.selected]: this.isSelected(item.key) })}>
        <a href="#" className={styles.anchor} onClick={this.handleClick.bind(this, item.key)}>
          <span className={styles.label}>{item.label}</span>
          <i className={classNames('fas fa-check', styles['ic-check'])}></i>
        </a>
      </li>
    ));
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
