import React, { useState } from 'react';
import Checkbox from './Checkbox.js';
import EditableParagraph from 'view/components/EditableParagraph';
import styled from 'styled-components';
import { Buttons, Button } from './Buttons';

const Item = styled.li`
  display: flex;
  padding: 0;
  margin: 0;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`;

const Description = styled.div`
  maegin: 0;
  padding: 0;
  flex-grow: 1;
  width: auto;
`;

const ChecklistItem = ({ task, isNew, onChange, onRemove, onChangeState }) => {
  const [editing, setEditing] = useState(false);

  if (isNew) task = { description: '', completed: false };

  const onChangeParagraphState = (paragraphState) => {
    setEditing(paragraphState === 'edit');
    if (onChangeState) onChangeState(paragraphState);
  };

  return (
    <Item>
      <Checkbox checked={task.completed} onClick={() => onChange({ ...task, completed: !task.completed })} />
      <Description>
        <EditableParagraph
          onChangeState={onChangeParagraphState}
          value={task.description}
          state={isNew ? 'edit' : 'show'}
          onChange={(value) => onChange({ ...task, description: value })}
        />
        {editing && (
          <Buttons>
            <Button
              type="danger"
              onClick={(e) => {
                onRemove(task.id);
                e.stopPropagation();
              }}
            >
              {isNew ? 'Cancelar' : 'Remover'}
            </Button>
          </Buttons>
        )}
      </Description>
    </Item>
  );
};

export default ChecklistItem;
