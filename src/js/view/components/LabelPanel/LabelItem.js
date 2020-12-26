import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import colors from './colors.js';

const Item = styled.li`
  display: flex;
  padding: 0;
  margin: 0;
  width: 100%;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`;

const SelectableLabel = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
  min-height: 20px;
  margin: 0 0 4px 8px;
  padding: 6px 12px;
  border-radius: 3px;
  background-color: ${(props) => colors[props.$color][0]};
  cursor: pointer;
  font-family: Helvetica Neue, Arial, Helvetica, sans-serif;

  &:hover {
    box-shadow: -8px 0 ${(props) => colors[props.$color][1]};
  }
`;

const Label = styled.p`
  flex-grow: 1;
  margin: 0;
  padding: 0;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
`;

const Checkmark = styled(FontAwesomeIcon).attrs(() => ({
  icon: faCheck,
}))`
  color: #fff;
  font-size: 14px;
`;

const Edit = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 0 0 6px;
  width: 20px;
  min-height: 20px;
  padding: 6px;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: rgba(9, 30, 66, 0.08);
  }
`;

const EditIcon = styled(FontAwesomeIcon).attrs(() => ({
  icon: faPencilAlt,
}))`
  color: #aaa;
  font-size: 14px;
`;

const LabelItem = ({ label, selected, onSelect, onUnSelect, onEditClick }) => {
  return (
    <Item>
      <SelectableLabel
        $color={label.color || 'default'}
        onClick={(e) => {
          e.preventDefault();
          if (selected && onUnSelect) onUnSelect();
          if (!selected && onSelect) onSelect();
        }}
      >
        <Label>{label.name}</Label>
        {selected && <Checkmark />}
      </SelectableLabel>
      <Edit
        title="Editar"
        onClick={(e) => {
          e.preventDefault();
          if (onEditClick) onEditClick();
        }}
      >
        <EditIcon />
      </Edit>
    </Item>
  );
};

LabelItem.defaultProps = {
  selected: false,
};

export default LabelItem;
