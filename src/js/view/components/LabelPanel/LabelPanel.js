import React, { useState } from 'react';
import FloatingPanel from 'view/components/FloatingPanel';
import styled from 'styled-components';

import LabelList from './LabelList';
import LabelEdit from './LabelEdit';

const Panel = styled(FloatingPanel)`
  position: absolute;
  top: 20px;
  right: 42px;
  min-width: auto;
  width: 260px;
`;

const LabelPanel = ({
  boardLabels,
  cardLabels,
  loading,
  onClose,
  onAddLabel,
  onRemoveLabel,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const [mode, setMode] = useState('list'); /* modes: list, edit, create */
  const [editingLabel, setEditingLabel] = useState(null);

  const getPanelTitle = () => {
    if (mode === 'edit') return 'Alterar Etiqueta';
    if (mode === 'create') return 'Criar Etiqueta';
    return 'Etiquetas';
  };

  const getShowBackButton = () => mode === 'edit' || mode === 'create';

  return (
    <Panel
      title={getPanelTitle()}
      showBackButton={getShowBackButton()}
      loading={loading}
      onBack={() => {
        setMode('list');
        setEditingLabel(null);
      }}
      onClose={onClose}
    >
      {mode === 'list' && (
        <LabelList
          boardLabels={boardLabels}
          cardLabels={cardLabels}
          onAddLabel={onAddLabel}
          onRemoveLabel={onRemoveLabel}
          onCreateClick={() => {
            setMode('create');
            setEditingLabel(null);
          }}
          onEditClick={(labelToEdit) => {
            setMode('edit');
            setEditingLabel(labelToEdit);
          }}
        />
      )}

      {mode === 'create' && (
        <LabelEdit
          mode="create"
          currentLabel={null}
          onCreate={(newLabel) => {
            onCreate(newLabel);
            setMode('list');
            setEditingLabel(null);
          }}
        />
      )}

      {mode === 'edit' && editingLabel && (
        <LabelEdit
          mode="edit"
          currentLabel={editingLabel}
          onEdit={(editedLabel) => {
            onEdit(editedLabel);
            setMode('list');
            setEditingLabel(null);
          }}
          onDelete={(labelID) => {
            onDelete(labelID);
            setMode('list');
            setEditingLabel(null);
          }}
        />
      )}
    </Panel>
  );
};

LabelPanel.defaultProps = {
  boardLabels: [],
  cardLabels: [],
};

export default LabelPanel;
