import React from 'react';

import styles from './styles.scss';
import classNames from 'classnames';
import loadingImg from './loading.svg';
import dueFormatter from './due.js';

class TrelloCard extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      showOptions: false,
      processTooltip: {
        show: false,
        x: 0,
        y: 0,
      },
    };
  }

  showTooltip (e) {
    this.setState({
      processTooltip: {
        show: true,
        x: e.target.offsetLeft,
        y: e.target.offsetTop,
      },
    });
    e.preventDefault();
  }

  hideTooltip (e) {
    this.setState({
      processTooltip: {
        show: false,
        x: 0,
        y: 0,
      },
    });
    e.preventDefault();
  }

  refreshCard (e) {
    if (!this.props.refreshCard) return;
    if (this.props.isLoading) return;
    this.props.refreshCard(this.props.cardID);
    e.preventDefault();
  }

  renderLabels () {
    let uiLabels = [];
    this.props.labels.forEach((label, idx) => {
      uiLabels.push(
        <span
          key={idx}
          className={classNames(styles.label, (styles[label.color] || styles.default))}
        >{label.label}</span>
      );
    });
    return uiLabels;
  }

  renderDue () {
    if (!this.props.due) return null;
    const due = dueFormatter(this.props.due, this.props.dueComplete);
    return (
      <li>
        <i className={classNames(styles['ic-footer'], 'far', 'fa-clock')}></i>
        <span>{due.date} <span className={classNames(styles['due-message'], styles['due-' + due.class])}>{due.message}</span></span>
      </li>
    );
  };

  extractProcessInfo () {
    const defaultInfo = { type: '', specification: '' };
    const info = this.props.originalAnchor.getAttribute('onmouseover');
    if (!info) return defaultInfo;
    const infosSplited = info.split('\'');
    if (infosSplited.length !== 5) return defaultInfo;
    return {
      type: infosSplited[3],
      specification: infosSplited[1] || '(sem especificação)',
    };
  }

  renderProcessTooltip () {

    const processInfo = this.extractProcessInfo();

    const elementStyle = {
      left: this.state.processTooltip.x,
      top: this.state.processTooltip.y + 20,
    };

    return (
      <div className={classNames(styles.processTooltip, { hide: !this.state.processTooltip.show })} style={elementStyle}>
        <h3>{processInfo.specification}</h3>
        <p>{processInfo.type}</p>
      </div>
    );

  }

  renderLoadingOverlay () {
    if (!this.props.isLoading) return null;
    return (
      <div className={styles.loadingOverlay}>
        <img src={loadingImg} className={styles.loadingImg} />
      </div>
    );
  }

  render () {
    return (
      <div className={styles.card} >
        {this.renderLoadingOverlay()}
        <div className={styles.options}>
          <a target='#' onClick={this.refreshCard.bind(this)}><i className='fas fa-sync-alt'></i></a>
          <a target='_blank' href={this.props.url}><i className='fas fa-external-link-alt'></i></a>
        </div>
        <h2 className={styles.name}>{this.props.name}</h2>
        <div className={styles.labels}>{this.renderLabels()}</div>
        <div className={styles.location}>em <u>{this.props.location.board.name}</u> / <u>{this.props.location.list.name}</u>.</div>
        <div className={classNames(styles.descr, { hide: (this.props.description.length === 0) })}>{this.props.description}</div>
        <div className={styles.footer}>
          <ul>
            <li>
              <i className={classNames(styles['ic-footer'], 'fas', 'fa-align-left')}></i>
              <a
                className={this.props.originalAnchor.getAttribute('class')}
                onMouseOver={this.showTooltip.bind(this)}
                onMouseOut={this.hideTooltip.bind(this)}
                href={this.props.originalAnchor.getAttribute('href')}>{this.props.originalAnchor.innerText.trim()}​</a>
              {this.renderProcessTooltip()}
            </li>
            {this.renderDue()}
          </ul>
        </div>
      </div>
    );
  }
};

export default TrelloCard;
