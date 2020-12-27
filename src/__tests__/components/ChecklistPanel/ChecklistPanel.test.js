import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ChecklistPanel from 'view/components/ChecklistPanel/ChecklistPanel';
import 'jest-styled-components';

const onChange = jest.fn();
const onRemove = jest.fn();
const onAdd = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

test('render tasks', () => {
  const { queryByText } = render(
    <ChecklistPanel
      tasks={[
        { id: 1, completed: false, description: 'Minha primeira tarefa' },
        { id: 2, completed: true, description: 'Minha segunda tarefa' },
        { id: 3, completed: false, description: 'Minha terceira tarefa' },
      ]}
    />
  );

  /* checar se as tarefas estão aparecendo */
  expect(queryByText('Minha primeira tarefa')).toBeTruthy();
  expect(queryByText('Minha segunda tarefa')).toBeTruthy();
  expect(queryByText('Minha terceira tarefa')).toBeTruthy();

  /* checar se o botão de adicionar está aparecendo */
  expect(queryByText('Adicionar')).toBeTruthy();
});

test('edit task', () => {
  const { queryByText, getByDisplayValue } = render(
    <ChecklistPanel tasks={[{ id: 1, completed: false, description: 'Minha primeira tarefa' }]} onChange={onChange} />
  );

  fireEvent.click(queryByText('Minha primeira tarefa'));
  expect(queryByText('Salvar')).toBeTruthy();
  expect(getByDisplayValue('Minha primeira tarefa')).toBeTruthy();
  fireEvent.change(getByDisplayValue('Minha primeira tarefa'), {
    target: { value: 'Minha primeira tarefa modificada' },
  });
  fireEvent.click(queryByText('Salvar'));

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ id: 1, description: 'Minha primeira tarefa modificada' })
  );
});

test('remove task', () => {
  const { queryByText } = render(
    <ChecklistPanel tasks={[{ id: 1, completed: false, description: 'Minha primeira tarefa' }]} onRemove={onRemove} />
  );

  fireEvent.click(queryByText('Minha primeira tarefa'));
  expect(queryByText('Remover')).toBeTruthy();
  fireEvent.click(queryByText('Remover'));

  expect(onRemove).toHaveBeenCalledTimes(1);
});

test('add task', () => {
  const { queryByText, queryAllByText, getByDisplayValue } = render(<ChecklistPanel tasks={[]} onAdd={onAdd} />);

  /* clica em adicionar */
  fireEvent.click(queryByText('Adicionar'));
  expect(queryAllByText('Adicionar').length).toBe(2);

  /* campo da nova tarefa */
  expect(getByDisplayValue('')).toBeTruthy();
  fireEvent.change(getByDisplayValue(''), { target: { value: 'Minha quarta tarefa' } });
  fireEvent.click(queryAllByText('Adicionar')[0]);

  expect(onAdd).toHaveBeenCalledTimes(1);
});
