import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ChecklistPanel from 'view/components/ChecklistPanel';
import 'jest-styled-components';

test('render', () => {
  const onChange = jest.fn();
  const onRemove = jest.fn();
  const onAdd = jest.fn();
  const { queryByText, queryAllByText, getByDisplayValue } = render(
    <ChecklistPanel
      tasks={[
        { id: 1, completed: false, description: 'Minha primeira tarefa' },
        { id: 2, completed: true, description: 'Minha segunda tarefa' },
        { id: 3, completed: false, description: 'Minha terceira tarefa' },
      ]}
      onRemove={onRemove}
      onAdd={onAdd}
      onChange={onChange}
    />
  );
  /* checar se as tarefas estão aparecendo */
  expect(queryByText('Minha primeira tarefa')).toBeTruthy();
  expect(queryByText('Minha segunda tarefa')).toBeTruthy();
  expect(queryByText('Minha terceira tarefa')).toBeTruthy();

  /* checar se o botão está aparecendo */
  expect(queryByText('Adicionar')).toBeTruthy();

  /* clica em adicionar */
  fireEvent.click(queryByText('Adicionar'));
  expect(queryAllByText('Adicionar').length).toBe(2);

  /* campo da nova tarefa */
  expect(getByDisplayValue('')).toBeTruthy();
  fireEvent.change(getByDisplayValue(''), { target: { value: 'Minha quarta tarefa' } });
  fireEvent.click(queryAllByText('Adicionar')[0]);

  expect(onAdd).toHaveBeenCalledTimes(1);
});
