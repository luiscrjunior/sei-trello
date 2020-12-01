import React, { useState } from 'react';
import ChecklistPanel from 'view/components/ChecklistPanel';
import { TrelloCardBG } from '../styles';

const initialTasks = [
  { id: 1, completed: false, description: 'Minha primeira tarefa' },
  { id: 2, completed: true, description: 'Minha segunda tarefa' },
  { id: 3, completed: false, description: 'Minha terceira tarefa' },
];

const ChecklistPanelPlayground = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const removeTask = (taskId) => {
    console.log(`remove task ${taskId}.`);
    setTasks(
      tasks.filter((task) => {
        return task.id === taskId ? false : true;
      })
    );
  };

  const updateTask = (updatedTask) => {
    console.log(`update task ${updatedTask.id}.`);
    setTasks(
      tasks.map((task) => {
        return task.id === updatedTask.id ? updatedTask : task;
      })
    );
  };

  const createTask = (updatedTask) => {
    console.log(`create task ${updatedTask.description}.`);
    setTasks([...tasks, { ...updatedTask, id: new Date().getUTCMilliseconds() }]);
  };

  return (
    <TrelloCardBG>
      <ChecklistPanel tasks={tasks} onRemove={removeTask} onAdd={createTask} onChange={updateTask} />
    </TrelloCardBG>
  );
};

export default ChecklistPanelPlayground;
