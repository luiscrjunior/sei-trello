import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import classNames from 'classnames';

import FloatingPanel from 'view/components/FloatingPanel';

import 'react-datepicker/dist/react-datepicker.css';
import styles from './styles.scss';

class DuePanel extends React.Component {

  render () {
    return (
      <FloatingPanel title='Data de entrega'>
        <div className={styles.wrapper}>
          <DatePicker
            inline
            locale="pt-BR"
          />
        </div>
        <div className={styles.wrapper}>
          <button className='btn btn-primary'>Remover</button>
        </div>
      </FloatingPanel>
    );
  }
};

export default DuePanel;
