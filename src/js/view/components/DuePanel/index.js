import React from 'react';
import ReactDOM from 'react-dom';
import FloatingPanel from 'view/components/FloatingPanel';
import classNames from 'classnames';

class DuePanel extends React.Component {

  constructor (props) {
    super(props);
  }

  render () {
    return (
      <FloatingPanel>
        Painel
      </FloatingPanel>
    );
  }
};

export default DuePanel;
