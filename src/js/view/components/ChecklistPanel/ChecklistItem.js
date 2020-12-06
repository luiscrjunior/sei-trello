import React from 'react';
import Checkbox from './Checkbox.js';
import EditableParagraph from 'view/components/EditableParagraphV2';
import styled from 'styled-components';

const Item = styled.li`
  display: flex;
  padding: 0;
  margin: 0;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`;

const Description = styled.div`
  margin: 0;
  padding: 0;
  flex-grow: 1;
  width: auto;
`;

const ChecklistItem = ({ task, isNew, onChange, onRemove, onCancel }) => {
  if (isNew) task = { description: '', completed: false };

  return (
    <Item data-id={task.id}>
      <Checkbox
        checked={isNew ? false : task.completed}
        onClick={() => onChange({ ...task, completed: !task.completed })}
      />
      <Description>
        <EditableParagraph
          completed={isNew ? false : task.completed}
          paragraphStyle={{
            textDecoration: task.completed ? 'line-through' : 'initial',
          }}
          value={isNew ? '' : task.description}
          editing={isNew}
          onChange={(value) => onChange({ ...task, description: value })}
          onRemove={() => onRemove(task.id)}
          onCancel={onCancel}
          buttons={isNew ? ['add', 'cancel'] : ['save', 'cancel', 'remove']}
        />
      </Description>
    </Item>
  );
};

export default ChecklistItem;
