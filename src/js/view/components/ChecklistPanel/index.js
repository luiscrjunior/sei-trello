import React, { useState, useRef } from 'react';
import FloatingPanel from 'view/components/FloatingPanel';
import ChecklistItem from './ChecklistItem';
import styled from 'styled-components';

import { Buttons, Button } from 'view/components/EditableParagraphV2/styles';
import LoadingOverlay from './LoadingOverlay';

const Panel = styled(FloatingPanel)`
  position: absolute;
  top: 20px;
  right: 42px;
  min-width: auto;
  width: 260px;
`;

const ChecklistItems = styled.ul`
  margin: 15px 0 15px 0;
  padding: 0 10px 0 0;
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
`;

const ChecklistPanel = ({ tasks, loading, onChange, onRemove, onAdd }) => {
  const [adding, setAdding] = useState(false);
  const list = useRef(null);

  const onCancelAdd = () => {
    setAdding(false);
  };

  const onListClick = () => {
    if (
      list.current &&
      document.activeElement &&
      list.current.contains(document.activeElement) &&
      document.activeElement.tagName.toLowerCase() === 'textarea'
    ) {
      const panel = document.activeElement.parentNode;
      panel.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  };

  return (
    <Panel title="Checklist">
      {loading && <LoadingOverlay />}
      <ChecklistItems ref={list} onClick={onListClick}>
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

ChecklistPanel.defaultProps = {
  loading: false,
};

export default ChecklistPanel;
