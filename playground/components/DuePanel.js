import React, { useState, useEffect } from 'react';
import DuePanel from 'view/components/DuePanel';
import { TrelloCardBG } from '../styles';

const DuePanelPlayground = () => {
  const [due, setDue] = useState(null);
  const [dueComplete, setDueComplete] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setOpen(true);
    }
  }, [open]);

  return (
    <TrelloCardBG>
      {open && (
        <DuePanel
          due={due}
          dueComplete={dueComplete}
          onChangeDue={(_due, _dueComplete) => {
            setDue(_due);
            setDueComplete(_dueComplete);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </TrelloCardBG>
  );
};

export default DuePanelPlayground;
