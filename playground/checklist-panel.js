import React from 'react';
import ReactDOM from 'react-dom';

import ChecklistPanel from 'view/components/ChecklistPanel';

if (module.hot) module.hot.accept();

const placeholder = document.querySelector('#app');

const render = () => {};

render();

class Flow {
  constructor(initialData) {
    this.data = initialData;
  }

  updateTask(updatedTask) {
    const updatedTasks = this.data.tasks.map((task) => {
      return task.id === updatedTask.id ? updatedTask : task;
    });
    this.data.tasks = updatedTasks;
    this.render();
  }

  render() {
    ReactDOM.render(
      <ChecklistPanel {...this.data} onChange={(updatedTask) => this.updateTask(updatedTask)} />,
      placeholder
    );
  }
}

const flow = new Flow({
  tasks: [
    { id: 1, completed: false, description: 'Minha primeira tarefa' },
    { id: 2, completed: true, description: 'Minha segunda tarefa' },
    { id: 3, completed: false, description: 'Minha terceira tarefa' },
  ],
});
flow.render();
