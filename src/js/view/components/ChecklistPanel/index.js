import React, { useState } from 'react';
import FloatingPanel from 'view/components/FloatingPanel';
import ChecklistItem from './ChecklistItem';
import { Buttons, Button } from './Buttons';
import styled from 'styled-components';

const Panel = styled(FloatingPanel)`
  position: absolute;
  top: 20px;
  right: 42px;
  min-width: auto;
  width: 240px;
`;

const ChecklistItems = styled.ul`
  margin: 15px 0 15px 0;
  padding: 0;
`;

const ChecklistPanel = ({ isLoading, tasks, onChange }) => {
  const [checked, setChecked] = useState(false);

  return (
    <Panel title="Checklist">
      <ChecklistItems>
        {tasks.map((task) => (
          <ChecklistItem key={task.id} onClick={() => setChecked(!checked)} task={task} onChange={onChange} />
        ))}
      </ChecklistItems>
      <Buttons>
        <Button>Adicionar</Button>
      </Buttons>
    </Panel>
  );
};

export default ChecklistPanel;
