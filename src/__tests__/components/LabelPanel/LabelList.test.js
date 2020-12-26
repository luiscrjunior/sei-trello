import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import LabelList from 'view/components/LabelPanel/LabelList';

test('render list', () => {
  const onAddLabel = jest.fn();
  const onRemoveLabel = jest.fn();
  const onCreateClick = jest.fn();
  const onEditClick = jest.fn();

  const { container, queryByText, queryAllByTitle } = render(
    <LabelList
      boardLabels={[
        { id: 'label1', name: 'urgente', color: 'red' },
        { id: 'label2', name: 'analisar', color: 'green' },
        { id: 'label3', name: '', color: 'yellow' },
      ]}
      cardLabels={[{ id: 'label1', name: 'urgente', color: 'red' }]}
      onAddLabel={onAddLabel}
      onRemoveLabel={onRemoveLabel}
      onCreateClick={onCreateClick}
      onEditClick={onEditClick}
    />
  );

  expect(container.querySelectorAll('li').length).toBe(3);

  /* verificar checkmarks apenas no primeiro item */
  expect(container.querySelectorAll('li')[0].querySelector('svg[data-icon="check"]')).toBeTruthy();
  expect(container.querySelectorAll('li')[1].querySelector('svg[data-icon="check"]')).not.toBeTruthy();
  expect(container.querySelectorAll('li')[2].querySelector('svg[data-icon="check"]')).not.toBeTruthy();

  /* desselecionar label urgente */
  const firstLabel = queryByText('urgente');
  expect(firstLabel).toBeTruthy();
  fireEvent.click(firstLabel);
  expect(onRemoveLabel).toHaveBeenNthCalledWith(1, expect.objectContaining({ id: 'label1' }));

  /* selecionar segundo label */
  const secondLabel = queryByText('analisar');
  expect(secondLabel).toBeTruthy();
  fireEvent.click(secondLabel);
  expect(onAddLabel).toHaveBeenNthCalledWith(1, expect.objectContaining({ id: 'label2' }));

  /* selecionar terceiro label */
  const thirdLabel = container.querySelectorAll('li')[2].querySelector('a');
  expect(thirdLabel).toBeTruthy();
  fireEvent.click(thirdLabel);
  expect(onAddLabel).toHaveBeenNthCalledWith(2, expect.objectContaining({ id: 'label3' }));

  /* clicar no botão editar */
  const btnEdits = queryAllByTitle('Editar');
  expect(btnEdits.length).toBe(3);
  fireEvent.click(btnEdits[0]);
  fireEvent.click(btnEdits[1]);
  fireEvent.click(btnEdits[2]);
  expect(onEditClick).toHaveBeenCalledTimes(3);

  /* clicar no botão criar */
  const btnCreate = queryByText('Criar uma nova etiqueta');
  expect(btnCreate).toBeTruthy();
  fireEvent.click(btnCreate);
  expect(onCreateClick).toHaveBeenCalledTimes(1);
});
