import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ChecklistItem from 'view/components/ChecklistPanel/ChecklistItem';
import 'jest-styled-components';

test('render not new', () => {
  const onChange = jest.fn();
  const onRemove = jest.fn();
  const onCancel = jest.fn();
  const { container, queryByText, getByDisplayValue } = render(
    <ChecklistItem
      task={{
        id: 1,
        completed: true,
        description: 'Primeira tarefa',
      }}
      isNew={false}
      onChange={onChange}
      onRemove={onRemove}
      onCancel={onCancel}
    />
  );
  expect(queryByText('Primeira tarefa')).toBeTruthy();
  expect(container.querySelector('li > div:first-child')).toHaveStyleRule('background-color', '#5ba4cf');

  /* clicar no checkbox */
  fireEvent.click(container.querySelector('li > div:first-child'));
  expect(onChange).toHaveBeenNthCalledWith(1, expect.objectContaining({ completed: false }));

  /* clicar no parágrafo para habilitar o modo de edição */
  fireEvent.click(queryByText('Primeira tarefa'));
  expect(getByDisplayValue('Primeira tarefa')).toBeTruthy();

  /* ver se os botões estão presentes */
  expect(queryByText('Salvar')).toBeTruthy();
  expect(queryByText('Remover')).toBeTruthy();
  expect(queryByText('Cancelar')).toBeTruthy();

  /* escrever nova descrição */
  fireEvent.change(getByDisplayValue('Primeira tarefa'), { target: { value: 'Outra tarefa' } });
  expect(getByDisplayValue('Outra tarefa')).toBeTruthy();

  /* clicar em salvar */
  fireEvent.click(queryByText('Salvar'));
  expect(onChange).toHaveBeenNthCalledWith(2, expect.objectContaining({ description: 'Outra tarefa' }));

  /* clicar em remover */
  fireEvent.click(queryByText('Primeira tarefa'));
  fireEvent.click(queryByText('Remover'));
  expect(onRemove).toHaveBeenCalledTimes(1);

  /* clicar em cancelar */
  fireEvent.click(queryByText('Primeira tarefa'));
  fireEvent.change(getByDisplayValue('Primeira tarefa'), { target: { value: 'Outra tarefa' } });
  fireEvent.click(queryByText('Cancelar'));
  expect(queryByText('Primeira tarefa')).toBeTruthy();
  expect(onCancel).toHaveBeenCalledTimes(1);
});

test('render new', () => {
  const onChange = jest.fn();
  const onCancel = jest.fn();
  const { container, queryByText, getByDisplayValue } = render(
    <ChecklistItem
      task={{
        id: 1,
        completed: true,
        description: 'Primeira tarefa',
      }}
      isNew={true}
      onChange={onChange}
      onCancel={onCancel}
    />
  );
  expect(container.querySelector('li > div:first-child')).toHaveStyleRule('background-color', '#fafbfc');

  expect(getByDisplayValue('')).toBeTruthy();
  expect(queryByText('Adicionar')).toBeTruthy();
  expect(queryByText('Cancelar')).toBeTruthy();

  fireEvent.change(getByDisplayValue(''), { target: { value: 'Outra tarefa' } });
  expect(getByDisplayValue('Outra tarefa')).toBeTruthy();

  /* clicar em adicionar */
  fireEvent.click(queryByText('Adicionar'));
  expect(onChange).toHaveBeenNthCalledWith(1, expect.objectContaining({ description: 'Outra tarefa' }));
  expect(queryByText('Clique para editar...')).toBeTruthy();

  /* clicar em cancelar */
  fireEvent.click(queryByText('Clique para editar...'));
  fireEvent.change(getByDisplayValue(''), { target: { value: 'Outra tarefa' } });
  fireEvent.click(queryByText('Cancelar'));
  expect(queryByText('Clique para editar...')).toBeTruthy();
  expect(onCancel).toHaveBeenCalledTimes(1);
});
