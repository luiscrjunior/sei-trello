import React, { useState, useEffect } from 'react';
import FloatingPanel from 'view/components/FloatingPanel';
import ChecklistItem from './ChecklistItem';
import styled from 'styled-components';

import { Buttons, Button } from 'view/components/EditableParagraphV2/styles';

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

const ChecklistPanel = ({ tasks, onChange, onRemove, onAdd }) => {
  const [adding, setAdding] = useState(false);

  const onCancelAdd = () => {
    setAdding(false);
  };

  return (
    <Panel title="Checklist">
      <ChecklistItems>
        {tasks.map((task) => (
          <ChecklistItem key={task.id} task={task} onChange={onChange} onRemove={onRemove} />
        ))}
        {adding && (
          <ChecklistItem
            isNew={true}
            onChange={(task) => {
              onAdd(task);
              onCancelAdd();
            }}
            onCancel={onCancelAdd}
          />
        )}
      </ChecklistItems>
      <Buttons>
        <Button
          onClick={() => {
            setAdding(true);
          }}
        >
          Adicionar
        </Button>
      </Buttons>
    </Panel>
  );
};

export default ChecklistPanel;
