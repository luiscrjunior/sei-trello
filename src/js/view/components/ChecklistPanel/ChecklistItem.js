import React from 'react';
import Checkbox from './Checkbox.js';
import EditableParagraph from 'view/components/EditableParagraph';
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
  maegin: 0;
  padding: 0;
  flex-grow: 1;
  width: auto;
`;

const ChecklistItem = ({ checked, value, onClick, onChange }) => {
  return (
    <Item>
      <Checkbox checked={checked} onClick={onClick} />
      <Description>
        <EditableParagraph value={value} onChange={onChange} />
      </Description>
    </Item>
  );
};

export default ChecklistItem;
