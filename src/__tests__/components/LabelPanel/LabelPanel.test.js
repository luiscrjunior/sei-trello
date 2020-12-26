import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import LabelPanel from 'view/components/LabelPanel/LabelPanel';

test('render panel', () => {
  const onAddLabel = jest.fn();
  const onRemoveLabel = jest.fn();
  const onCreate = jest.fn();
  const onEdit = jest.fn();
  const onDelete = jest.fn();

  const { container, queryByText, getByTestId, queryByDisplayValue } = render(
    <LabelPanel
      boardLabels={[
        { id: 'label1', name: 'urgente', color: 'red' },
        { id: 'label2', name: 'analisar', color: 'green' },
        { id: 'label3', name: '', color: 'yellow' },
      ]}
      cardLabels={[{ id: 'label1', name: 'urgente', color: 'red' }]}
      onAddLabel={onAddLabel}
      onRemoveLabel={onRemoveLabel}
      onCreate={onCreate}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );

  expect(getByTestId('title').textContent).toBe('Etiquetas');

  /* Criar uma etiqueta */
  fireEvent.click(queryByText('Criar uma nova etiqueta'));
  expect(getByTestId('title').textContent).toBe('Criar Etiqueta');
  let input = container.querySelector('input');
  fireEvent.change(input, { target: { value: 'Nome da etiqueta' } });
  fireEvent.click(getByTestId('color-red'));
  fireEvent.click(queryByText('Criar'));
  expect(onCreate).toHaveBeenNthCalledWith(1, expect.objectContaining({ color: 'red', name: 'Nome da etiqueta' }));

  /* Editar uma etiqueta */
  fireEvent.click(container.querySelectorAll('a[title="Editar"]')[0]);
  expect(getByTestId('title').textContent).toBe('Alterar Etiqueta');
  input = queryByDisplayValue('urgente');
  expect(input).toBeTruthy();
  fireEvent.change(input, { target: { value: 'outro nome para a etiqueta' } });
  fireEvent.click(getByTestId('color-green'));
  fireEvent.click(queryByText('Salvar'));
  expect(onEdit).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ color: 'green', name: 'outro nome para a etiqueta' })
  );

  /* Remover uma etiqueta */
  fireEvent.click(container.querySelectorAll('a[title="Editar"]')[0]);
  expect(getByTestId('title').textContent).toBe('Alterar Etiqueta');
  fireEvent.click(queryByText('Excluir'));
  expect(onDelete).toHaveBeenNthCalledWith(1, 'label1');

  /* Desselecionar a primeira etiqueta */
  fireEvent.click(container.querySelectorAll('li')[0].querySelector('a'));
  expect(onRemoveLabel).toHaveBeenNthCalledWith(1, expect.objectContaining({ id: 'label1' }));

  /* Selecionar a segunda etiqueta */
  fireEvent.click(container.querySelectorAll('li')[1].querySelector('a'));
  expect(onAddLabel).toHaveBeenNthCalledWith(1, expect.objectContaining({ id: 'label2' }));
});
