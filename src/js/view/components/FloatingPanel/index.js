import React from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.scss';
import classNames from 'classnames';

class FloatingPanel extends React.Component {

  constructor (props) {
    super(props);
    this.onBGClick = this.onBGClick.bind(this);
  }

  onClose (e) {
    e.preventDefault();
    if (!this.props.onClose) return;
    this.props.onClose();
  }

  onBGClick (e) {
    const clickedElement = e.target;
    const panel = ReactDOM.findDOMNode(this.panel);
    const elementInsideFilter = panel.contains(clickedElement);
    if (!elementInsideFilter) this.onClose(e);
  }

  componentDidMount () {
    document.querySelector('body').addEventListener('click', this.onBGClick);
  }

  componentWillUnmount () {
    document.querySelector('body').removeEventListener('click', this.onBGClick);
  }

  render () {
    return (
      <div
        className={classNames(styles.panel, this.props.className)}
        ref={(el) => { this.panel = el; }}>
        <span className={styles.title}>{this.props.title}</span>
        <a href="#" className={styles['btn-close']} onClick={this.onClose.bind(this)}>&times;</a>
        <div className={styles.content}>{this.props.children}</div>
      </div>
    );
  }
};

export default FloatingPanel;
