import React from 'react';
import DuePanel from 'view/components/DuePanel';
import { TrelloCardBG } from '../styles';

const DuePanelPlayground = () => {
  return (
    <TrelloCardBG>
      <DuePanel due="2018-06-09T14:00:00.000Z" dueComplete={true} />
    </TrelloCardBG>
  );
};

export default DuePanelPlayground;
