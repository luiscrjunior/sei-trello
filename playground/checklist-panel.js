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

  removeTask(taskId) {
    console.log(`remove task ${taskId}.`);
    this.data.tasks = this.data.tasks.filter((task) => {
      return task.id === taskId ? false : true;
    });
    this.render();
  }

  updateTask(updatedTask) {
    console.log(`update task ${updatedTask.id}.`);
    this.data.tasks = this.data.tasks.map((task) => {
      return task.id === updatedTask.id ? updatedTask : task;
    });
    this.render();
  }

  createTask(updatedTask) {
    console.log(`create task ${updatedTask.description}.`);
    this.data.tasks = [...this.data.tasks, { ...updatedTask, id: new Date().getUTCMilliseconds() }];
    this.render();
  }

  render() {
    ReactDOM.render(
      <ChecklistPanel
        {...this.data}
        onRemove={this.removeTask.bind(this)}
        onAdd={this.createTask.bind(this)}
        onChange={this.updateTask.bind(this)}
      />,
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
