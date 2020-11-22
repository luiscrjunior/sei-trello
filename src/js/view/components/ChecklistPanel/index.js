import React, { useState, useEffect } from 'react';
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

const ChecklistPanel = ({ tasks, onChange, onRemove, onAdd }) => {
  const [adding, setAdding] = useState(false);

  /* toda vez que atualizar a lista de tarefas, cancela adicionar nova tarefa */
  useEffect(() => {
    setAdding(false);
  }, [tasks]);

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
            key={-1}
            isNew={true}
            onChange={(task) => {
              if (task.description) {
                onAdd(task);
              } else {
                onCancelAdd();
              }
            }}
            onRemove={onCancelAdd}
            onChangeState={(state) => {
              if (state === 'show') onCancelAdd();
            }}
          />
        )}
      </ChecklistItems>
      <Buttons>
        <Button
          onClick={(e) => {
            setAdding(true);
            e.stopPropagation();
          }}
        >
          Adicionar
        </Button>
      </Buttons>
    </Panel>
  );
};

export default ChecklistPanel;
