import React from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.scss';
import classNames from 'classnames';
import loadingImg from './loading.svg';

class ContextMenu extends React.Component {
  constructor(props) {
    super(props);
    this.onBGClick = this.onBGClick.bind(this);
  }

  onClose() {
    if (!this.props.onClose) return;
    this.props.onClose();
  }

  onClick(key, e) {
    e.preventDefault();
    if (!this.props.onClick) return;
    this.props.onClick(key);
  }

  onBGClick(e) {
    const clickedElement = e.target;
    const menu = ReactDOM.findDOMNode(this.menu);
    const wrapper = menu.closest('.btn-menu-trigger') || menu;
    const elementInsideWrapper = wrapper.contains(clickedElement);
    if (!elementInsideWrapper) this.onClose();
  }

  componentDidUpdate() {
    if (this.menu) {
      this.menu.scrollIntoView({ block: 'nearest', inline: 'start', behavior: 'smooth' });
    }
  }

  componentDidMount() {
    document.querySelector('body').addEventListener('click', this.onBGClick);
  }

  componentWillUnmount() {
    document.querySelector('body').removeEventListener('click', this.onBGClick);
  }

  renderLoading() {
    return (
      <li className={styles.item}>
        <img src={loadingImg} className={styles.loadingImg} />
      </li>
    );
  }

  renderItems() {
    if (!this.props.items) return null;
    return this.props.items.map((item, idx) => (
      <li key={idx} className={styles.item}>
        <a href="#" onClick={this.onClick.bind(this, item.key)}>
          {item.label}
        </a>
      </li>
    ));
  }

  render() {
    return (
      <ul
        ref={(el) => {
          this.menu = el;
        }}
        className={classNames(styles.list, this.props.className)}
      >
        {this.props.isLoading ? this.renderLoading() : this.renderItems()}
      </ul>
    );
  }
}

export default ContextMenu;
