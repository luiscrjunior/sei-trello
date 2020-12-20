import React, { useState, useRef, useEffect } from 'react';
import FloatingPanel from 'view/components/FloatingPanel';
import ChecklistItem from './ChecklistItem';
import styled from 'styled-components';

import { Buttons, Button } from 'view/components/EditableParagraphV2/styles';
import LoadingOverlay from './LoadingOverlay';

import dragula from 'dragula';

const Panel = styled(FloatingPanel)`
  position: absolute;
  top: 20px;
  right: 42px;
  min-width: auto;
  width: 260px;
`;

const ChecklistItems = styled.ul`
  list-style: none;
  margin: 15px 0 15px 0;
  padding: 0 10px 0 0;
  min-height: 60px;
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
`;

const NoItemMessage = styled.li`
  margin: 0;
  padding: 0;
  font-size: 12px;
  font-style: italic;
  text-align: center;
  color: #424242;
`;

const ChecklistPanel = ({ tasks, loading, onChange, onChangeOrder, onRemove, onAdd, onClose }) => {
  const [adding, setAdding] = useState(false);
  const list = useRef(null);
  const drake = useRef(null);

  useEffect(() => {
    if (list.current && onChangeOrder) {
      drake.current = dragula([list.current], {
        moves: (el, source, handle) => handle.tagName.toLowerCase() === 'p',
      });
      drake.current.on('drop', (el) => {
        if (list.current) {
          const listItems = Array.from(list.current.children);
          const idx = listItems.indexOf(el);
          if (idx > -1) {
            const taskId = el.getAttribute('data-id');
            onChangeOrder(taskId, idx);
          }
        }
        drake.current.cancel(true);
      });
    }
    return () => {
      if (drake.current) drake.current.destroy();
    };
  }, [onChangeOrder]);

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
      panel.scrollIntoView({ block: 'nearest', inline: 'start', behavior: 'smooth' });
    }
  };

  return (
    <Panel title="Checklist" onClose={onClose}>
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
        {tasks.length === 0 && !adding && <NoItemMessage>Você não possui itens no checklist.</NoItemMessage>}
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
  tasks: [],
};

export default ChecklistPanel;
