import React, { useState } from 'react';
import LabelPanel from 'view/components/LabelPanel/LabelPanel';
import { TrelloCardBG } from '../styles';

const initialBoardLabels = [
  { id: 'label1', name: 'urgente', color: 'red' },
  { id: 'label2', name: '', color: 'yellow' },
  { id: 'label3', name: '', color: 'purple' },
  { id: 'label4', name: '', color: 'blue' },
  { id: 'label5', name: '', color: 'green' },
  { id: 'label6', name: '', color: 'orange' },
  { id: 'label7', name: '', color: 'black' },
  { id: 'label8', name: '', color: 'sky' },
  { id: 'label9', name: '', color: 'pink' },
  { id: 'label10', name: '', color: 'lime' },
  { id: 'label11', name: '', color: null },
];

const initialCardLabels = [{ id: 'label1', name: 'urgente', color: 'red' }];

const LabelPanelPlayground = () => {
  const [cardLabels, setCardLabels] = useState(initialCardLabels);
  const [boardLabels, setBoardLabels] = useState(initialBoardLabels);

  return (
    <TrelloCardBG>
      <LabelPanel
        boardLabels={boardLabels}
        cardLabels={cardLabels}
        onAddLabel={(label) => setCardLabels([...cardLabels, label])}
        onRemoveLabel={(label) => setCardLabels(cardLabels.filter((cardLabel) => cardLabel.id !== label.id))}
        onCreate={(label) => {
          const newLabel = { ...label, id: `label${boardLabels.length + 1}` };
          setBoardLabels([...boardLabels, newLabel]);
          setCardLabels([...cardLabels, newLabel]);
        }}
        onEdit={(editedLabel) => {
          setBoardLabels(
            boardLabels.map((boardLabel) => (boardLabel.id === editedLabel.id ? { ...editedLabel } : boardLabel))
          );
          setCardLabels(
            cardLabels.map((cardLabel) => (cardLabel.id === editedLabel.id ? { ...editedLabel } : cardLabel))
          );
        }}
        onDelete={(labelID) => {
          setBoardLabels(boardLabels.filter((boardLabel) => boardLabel.id !== labelID));
          setCardLabels(cardLabels.filter((cardLabel) => cardLabel.id !== labelID));
        }}
      />
    </TrelloCardBG>
  );
};

export default LabelPanelPlayground;
