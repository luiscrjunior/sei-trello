import React from 'react';
import styles from './styles.scss';
import classNames from 'classnames';

import ContextMenu from 'view/components/ContextMenu';

class CardLocationSelector extends React.Component {

  constructor (props) {
    super(props);
    this.state = { menuOpen: false };
  }

  onCloseMenu () {
    this.setState({ menuOpen: false });
  }

  onCaretClick (e) {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.showSelector === true && nextProps.showSelector === false) {
      this.setState({ menuOpen: false }); /* turn off menu when user hover out card */
    }
  }

  render () {
    return (
      <div className={classNames(styles.wrapper, 'btn-menu-trigger')}>

        <span
          className={styles.label}>{this.props.selected.name}<i
            className={classNames('fas fa-caret-down', styles.caret, { [styles.show]: this.props.showSelector })}
            onClick={this.onCaretClick.bind(this)}></i>
        </span>

        <ContextMenu
          className={classNames({ hide: !this.state.menuOpen }) }
          onClose={this.onCloseMenu.bind(this)}
          items={[{label: 'SEI'}, {label: 'OUTROS'}]}
          isLoading={false}></ContextMenu>
      </div>
    );
  }
};

export default CardLocationSelector;
