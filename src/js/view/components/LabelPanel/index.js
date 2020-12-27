import React, { useState, useEffect, useCallback } from 'react';
import LabelPanel from './LabelPanel';

import * as api from 'api';
import * as actions from 'actions/trello.js';
import * as alert from 'view/alert.js';

const LabelPanelContainer = ({ boardID, cardID, cardLabels, onClose }) => {
  const [boardLabels, setBoardLabels] = useState([]);
  const [loading, setLoading] = useState(false);

  const onAddLabel = async (label) => {
    setLoading(true);
    try {
      await api.addLabelToCard(cardID, label.id);
      await actions.doRefreshCardsWithID(cardID);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert.error('Não foi possível adicionar a etiqueta ao cartão.');
      onClose();
    }
  };

  const onRemoveLabel = async (label) => {
    setLoading(true);
    try {
      await api.removeLabelFromCard(cardID, label.id);
      await actions.doRefreshCardsWithID(cardID);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert.error('Não foi possível remover a etiqueta ao cartão.');
      onClose();
    }
  };

  const onCreate = async (label) => {
    setLoading(true);
    try {
      const {
        data: { id },
      } = await api.createLabel(boardID, label);
      await api.addLabelToCard(cardID, id);
      await actions.doRefreshCardsWithID(cardID);
      await fetchLabels();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert.error('Não foi possível criar a etiqueta.');
      onClose();
    }
  };

  const onEdit = async (label) => {
    setLoading(true);
    try {
      const { id, ...labelData } = label;
      await api.updateLabel(id, labelData);
      await actions.doRefreshCardsWithID(cardID);
      await fetchLabels();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert.error('Não foi possível editar a etiqueta.');
      onClose();
    }
  };

  const onDelete = async (labelID) => {
    setLoading(true);
    try {
      await api.deleteLabel(labelID);
      await actions.doRefreshCardsWithID(cardID);
      await fetchLabels();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert.error('Não foi possível deletar a etiqueta.');
      onClose();
    }
  };

  const fetchLabels = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.getBoardLabels(boardID);
      if ('data' in response && response.data.length > 0) {
        let updatedBoardLabels = [...response.data];
        setBoardLabels(updatedBoardLabels);
      } else {
        setBoardLabels([]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert.error('Não foi possível obter as etiquetas deste quadro.');
      onClose();
    }
  }, [boardID, onClose]);

  /* fetch inicial */
  useEffect(() => {
    (async () => {
      await fetchLabels();
    })();
  }, [fetchLabels]);

  return (
    <LabelPanel
      loading={loading}
      boardLabels={boardLabels}
      cardLabels={cardLabels}
      onClose={onClose}
      onAddLabel={onAddLabel}
      onRemoveLabel={onRemoveLabel}
      onCreate={onCreate}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default LabelPanelContainer;
