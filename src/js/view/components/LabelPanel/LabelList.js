import React from 'react';
import styled from 'styled-components';
import Button from 'view/components/Button';
import LabelItem from './LabelItem';

const List = styled.ul`
  list-style: none;
  margin: 15px 0 15px 0;
  padding: 0 10px 0 0;
`;

const NoItemMessage = styled.li`
  margin: 0;
  padding: 0;
  font-size: 12px;
  font-style: italic;
  text-align: center;
  color: #424242;
`;

export const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  margin: 6px 0 0 0;
  padding: 0 10px 0 8px;
`;

export const CreateLabelButton = styled(Button)`
  flex-grow: 1;
  font-weight: 500;
  outline: none;
`;

const LabelList = ({ boardLabels, cardLabels, onAddLabel, onRemoveLabel, onCreateClick, onEditClick }) => {
  const isSelected = (boardLabel) => cardLabels.some((cardLabel) => cardLabel.id === boardLabel.id);

  return (
    <>
      <List data-testid="board-labels">
        {boardLabels.map((boardLabel) => (
          <LabelItem
            key={boardLabel.id}
            label={boardLabel}
            selected={isSelected(boardLabel)}
            onSelect={() => {
              if (onAddLabel) onAddLabel(boardLabel);
            }}
            onUnSelect={() => {
              if (onAddLabel) onRemoveLabel(boardLabel);
            }}
            onEditClick={onEditClick}
          />
        ))}
        {boardLabels.length === 0 && <NoItemMessage>Não há etiquetas.</NoItemMessage>}
      </List>
      <Buttons>
        <CreateLabelButton onClick={onCreateClick}>Criar uma nova etiqueta</CreateLabelButton>
      </Buttons>
    </>
  );
};

LabelList.defaultProps = {
  boardLabels: [],
  cardLabels: [],
};

export default LabelList;
