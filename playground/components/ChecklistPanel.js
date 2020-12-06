import React, { useState } from 'react';
import ChecklistPanel from 'view/components/ChecklistPanel/ChecklistPanel';
import { TrelloCardBG } from '../styles';

const tasks = [
  { id: '1', completed: true, description: 'Minha primeira tarefa' },
  { id: '2', completed: true, description: 'Minha segunda tarefa' },
  { id: '3', completed: false, description: 'Minha terceira tarefa' },
  { id: '4', completed: false, description: 'Minha quarta tarefa' },
  { id: '5', completed: false, description: 'Minha quinta tarefa' },
  { id: '6', completed: false, description: 'Minha sexta tarefa' },
];

const ChecklistPanelPlayground = () => {
  const [data, setData] = useState({ isLoading: false, tasks: tasks });

  const removeTask = (taskId) => {
    console.log(`remove task ${taskId}.`);
    setData({ ...data, isLoading: true });
    setTimeout(() => {
      setData({
        isLoading: false,
        tasks: data.tasks.filter((task) => {
          return task.id === taskId ? false : true;
        }),
      });
    }, 500);
  };

  const updateTask = (updatedTask) => {
    console.log(`update task ${updatedTask.id}.`);
    setData({ ...data, isLoading: true });
    setTimeout(() => {
      setData({
        isLoading: false,
        tasks: data.tasks.map((task) => {
          return task.id === updatedTask.id ? updatedTask : task;
        }),
      });
    }, 500);
  };

  const updateTaskOrder = (taskId, newPosition) => {
    console.log(`move task ${taskId} to position ${newPosition}.`);
    setData({ ...data, isLoading: true });
    setTimeout(() => {
      const taskToMove = data.tasks.find((task) => task.id === taskId);
      const taskIdx = data.tasks.indexOf(taskToMove);
      const newTasks = [...data.tasks];
      newTasks.splice(taskIdx, 1);
      newTasks.splice(newPosition, 0, taskToMove);
      setData({
        isLoading: false,
        tasks: newTasks,
      });
    }, 500);
  };

  const createTask = (updatedTask) => {
    console.log(`create task ${updatedTask.description}.`);
    setData({ ...data, isLoading: true });
    setTimeout(() => {
      setData({
        isLoading: false,
        tasks: [...data.tasks, { ...updatedTask, id: new Date().getUTCMilliseconds() }],
      });
    }, 500);
  };

  return (
    <TrelloCardBG>
      <ChecklistPanel
        loading={data.isLoading}
        tasks={data.tasks}
        onRemove={removeTask}
        onAdd={createTask}
        onChange={updateTask}
        onChangeOrder={updateTaskOrder}
      />
    </TrelloCardBG>
  );
};

export default ChecklistPanelPlayground;
