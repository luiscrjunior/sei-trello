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

const ChecklistPanel = ({ tasks, onChange, onRemove }) => {
  return (
    <Panel title="Checklist">
      <ChecklistItems>
        {tasks.map((task) => (
          <ChecklistItem key={task.id} task={task} onChange={onChange} onRemove={onRemove} />
        ))}
      </ChecklistItems>
      <Buttons>
        <Button>Adicionar</Button>
      </Buttons>
    </Panel>
  );
};

export default ChecklistPanel;
