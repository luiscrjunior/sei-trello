import isEqual from 'lodash/isEqual';

import React from 'react';
import styles from './styles.scss';
import classNames from 'classnames';

import ContextMenu from 'view/components/ContextMenu';

import * as api from 'api/trello.js';

import { CaretIcon } from './styles.js';

class CardLocationSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      isLoading: false,
      items: [],
    };
  }

  onCloseMenu() {
    this.setState({ menuOpen: false });
  }

  onCaretClick() {
    if (this.state.menuOpen === false) {
      this.setState({
        menuOpen: true,
        isLoading: true,
      });
      if (this.props.type === 'board') this.loadBoards();
      if (this.props.type === 'list') this.loadLists();
    } else {
      this.setState({
        menuOpen: false,
        isLoading: true,
      });
    }
  }

  setItems(newItems) {
    this.setState({
      isLoading: false,
      items: newItems.map((item) => {
        return {
          label: item.name,
          key: item,
        };
      }),
    });
  }

  loadBoards() {
    api
      .searchAllBoards()
      .then((data) => this.setItems(data.data.boards))
      .catch((error) => {
        this.setState({ menuOpen: false });
        console.log(error);
      });
  }

  loadLists() {
    api
      .getListsFromBoard(this.props.currentBoard.id)
      .then((data) => this.setItems(data.data.lists))
      .catch((error) => {
        this.setState({ menuOpen: false });
        console.log(error);
      });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.showSelector === true && nextProps.showSelector === false) {
      this.setState({ menuOpen: false }); /* turn off menu when user hover out card */
    }
  }

  onItemClick(key) {
    this.setState({ menuOpen: false });
    if (isEqual(key, this.props.selected)) return;
    if (!this.props.onChange) return;
    this.props.onChange(this.props.type, key);
  }

  render() {
    return (
      <div className={classNames(styles.wrapper, 'btn-menu-trigger')}>
        <span className={styles.label}>
          {this.props.selected.name}
          <CaretIcon $show={this.props.showSelector} onClick={this.onCaretClick.bind(this)} />
        </span>

        <ContextMenu
          className={classNames({ hide: !this.state.menuOpen })}
          onClose={this.onCloseMenu.bind(this)}
          onClick={this.onItemClick.bind(this)}
          items={this.state.items}
          isLoading={this.state.isLoading}
        ></ContextMenu>
      </div>
    );
  }
}

export default CardLocationSelector;
