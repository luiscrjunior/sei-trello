import React, { useState, useEffect, useCallback } from 'react';
import ChecklistPanel from './ChecklistPanel';

import * as api from 'api/trello.js';
import * as alert from 'view/alert.js';

const ChecklistPanelContainer = ({ cardID, onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [checklistID, setChecklistID] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchChecklistItems = useCallback(async () => {
    const response = await api.getCardChecklistData(cardID);
    if ('data' in response && response.data.length > 0) {
      const checklist = response.data[0]; /* seleciona o primeiro checklist da lista */
      setChecklistID(checklist.id);
      const items = checklist.checkItems.map((checkItem) => ({
        id: checkItem.id,
        description: checkItem.name,
        completed: checkItem.state === 'complete',
        pos: checkItem.pos,
      }));
      items.sort((a, b) => a.pos - b.pos);
      setTasks(items);
    }
  }, [cardID]);

  const udpateChecklistItem = async (data) => {
    try {
      await api.updateCardChecklistItem(cardID, data.id, {
        name: data.description,
        state: data.completed ? 'complete' : 'incomplete',
      });
    } catch (e) {
      alert.error('Não foi possível salvar o item do checklist.');
    }
  };

  const udpateChecklistItemPosition = async (checklistItemID, position) => {
    try {
      await api.updateCardChecklistItem(cardID, checklistItemID, { pos: position });
    } catch (e) {
      alert.error('Não foi possível alterar a ordem do item do checklist.');
    }
  };

  const deleteChecklistItem = async (checklistItemID) => {
    try {
      await api.deleteCardChecklistItem(checklistID, checklistItemID);
    } catch (e) {
      alert.error('Não foi possível remover o item do checklist.');
    }
  };

  const createChecklistItem = async (data) => {
    try {
      let checklistIDToSave;
      /* se não tiver checklist vinculado ao cartão, cria um automaticamente */
      if (!checklistID) {
        const response = await api.createCardChecklist(cardID, 'Checklist (SEI)');
        const newChecklistID = response.data.id;
        setChecklistID(newChecklistID);
        checklistIDToSave = newChecklistID;
      } else {
        checklistIDToSave = checklistID;
      }
      await api.createCardChecklistItem(checklistIDToSave, {
        name: data.description,
        state: data.completed ? 'complete' : 'incomplete',
        position: 'bottom',
      });
    } catch (e) {
      alert.error('Não foi possível criar item no checklist.');
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await fetchChecklistItems();
        setLoading(false);
      } catch (error) {
        setLoading(false);
        alert.error('Não foi possível obter informações sobre o checklist deste cartão.');
        onClose();
      }
    })();
  }, [fetchChecklistItems, onClose]);

  const onChange = async (data) => {
    setLoading(true);
    await udpateChecklistItem(data);
    await fetchChecklistItems();
    setLoading(false);
  };

  const onChangeOrder = async (checklistItemID, newPosition) => {
    setLoading(true);
    let position = 0;
    if (newPosition === 0) {
      position = 'top';
    } else if (newPosition === tasks.length - 1) {
      position = 'bottom';
    } else {
      const difference = (tasks[newPosition].pos - tasks[newPosition - 1].pos) / 2;
      position = tasks[newPosition - 1].pos + difference;
    }
    await udpateChecklistItemPosition(checklistItemID, position);
    await fetchChecklistItems();
    setLoading(false);
  };

  const onRemove = async (checklistItemID) => {
    setLoading(true);
    await deleteChecklistItem(checklistItemID);
    await fetchChecklistItems();
    setLoading(false);
  };

  const onAdd = async (data) => {
    setLoading(true);
    await createChecklistItem(data);
    await fetchChecklistItems();
    setLoading(false);
  };

  return (
    <ChecklistPanel
      tasks={tasks}
      loading={loading}
      onChange={onChange}
      onChangeOrder={onChangeOrder}
      onRemove={onRemove}
      onAdd={onAdd}
      onClose={onClose}
    />
  );
};

export default ChecklistPanelContainer;
