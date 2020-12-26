import React from 'react';

import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import parseISO from 'date-fns/parseISO';

import Switch from 'react-toggle-switch';

import classNames from 'classnames';

import Button from 'view/components/Button';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-toggle-switch/dist/css/switch.min.css';
import styles from './styles.scss';

import { Panel } from './styles.js';

registerLocale('ptBR', ptBR);
setDefaultLocale('ptBR');

class DuePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDue: this.props.due ? parseISO(this.props.due) : null,
      selectedDueComplete: this.props.dueComplete || false,
    };
  }

  onDateChange(newDate) {
    if (!this.props.onChangeDue) return;
    this.setState({ selectedDue: newDate });
  }

  onDueCompleteChange() {
    this.setState({ selectedDueComplete: !this.state.selectedDueComplete });
  }

  onSaveDue() {
    if (!this.state.selectedDue) {
      this.props.onClose();
      return;
    }
    if (this.props.onChangeDue) {
      this.props.onChangeDue(this.state.selectedDue.toISOString(), this.state.selectedDueComplete);
    }
  }

  onRemoveDue() {
    if (this.props.onChangeDue) this.props.onChangeDue(null, false);
  }

  render() {
    return (
      <Panel title="Data de entrega" onClose={this.props.onClose}>
        <div className={styles.wrapper}>
          <DatePicker
            selected={this.state.selectedDue}
            inline
            onChange={this.onDateChange.bind(this)}
            disabledKeyboardNavigation
          />
        </div>
        <div className={classNames([styles.wrapper, styles['due-complete-wrapper']])}>
          <Switch onClick={this.onDueCompleteChange.bind(this)} on={this.state.selectedDueComplete} />
          <span>Entrega concluída</span>
        </div>
        <div className={styles.wrapper}>
          <Button onClick={this.onSaveDue.bind(this)} className={styles.left} type="success">
            Salvar
          </Button>
          <Button onClick={this.onRemoveDue.bind(this)} className={styles.right} type="danger">
            Remover
          </Button>
        </div>
      </Panel>
    );
  }
}

export default DuePanel;
