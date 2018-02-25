import React from 'react';

import styles from './styles.scss';
import classNames from 'classnames';
import loadingImg from './loading.svg';
import dueFormatter from './due.js';
import EditableParagraph from 'view/components/EditableParagraph';

class TrelloCard extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      showOptions: false,
      isEditingDescription: false,
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

  onChangeName (newName) {
    if (this.props.onChangeName) this.props.onChangeName(this.props.cardID, newName);
  }

  onChangeDescription (newDescription) {
    if (this.props.onChangeDescription) this.props.onChangeDescription(this.props.cardID, newDescription);
  };

  renderLabels () {
    if (this.props.labels.length === 0) return null;
    let uiLabels = [];
    this.props.labels.forEach((label, idx) => {
      uiLabels.push(
        <span
          key={idx}
          className={classNames(styles.label, (styles['label-' + label.color] || styles.default))}
        >{label.label}</span>
      );
    });
    return <div className={styles.labels}>{uiLabels}</div>;
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
        <img src={loadingImg} className={loadingImg} />
      </div>
    );
  }

  render () {

    const isDescriptionEmpty = !(typeof this.props.description === 'string' && this.props.description.length > 0);

    return (
      <div className={styles.card} >

        {this.renderLoadingOverlay()}

        <div className={styles.options}>
          <a target='#' onClick={this.refreshCard.bind(this)}><i className='fas fa-sync-alt'></i></a>
          <a target='_blank' href={this.props.url}><i className='fas fa-external-link-alt'></i></a>
        </div>

        <EditableParagraph
          paragraphClass={styles.name}
          value={this.props.name}
          onChange={(value) => { this.onChangeName(value); }} ></EditableParagraph>

        {this.renderLabels()}

        <div className={styles.location}>em <u>{this.props.location.board.name}</u> / <u>{this.props.location.list.name}</u>.</div>

        <EditableParagraph
          wrapperClass={classNames(styles['descr-wrapper'], { [styles['hide']]: isDescriptionEmpty && !this.state.isEditingDescription })}
          paragraphClass={styles.descr}
          value={this.props.description}
          onChangeState={(status) => { this.setState({isEditingDescription: (status === 'edit')}); } }
          onChange={(value) => { this.onChangeDescription(value); }} ></EditableParagraph>

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
