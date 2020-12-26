import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import LabelItem from 'view/components/LabelPanel/LabelItem';
import 'jest-styled-components';

test('render unselected label', () => {
  const onSelect = jest.fn();
  const onUnSelect = jest.fn();
  const onEdit = jest.fn();
  const { container, queryByText, queryByTitle } = render(
    <LabelItem
      label={{
        id: 'label1',
        name: 'urgente',
        color: 'red',
      }}
      selected={false}
      onSelect={onSelect}
      onUnSelect={onUnSelect}
      onEdit={onEdit}
    />
  );
  const lblName = queryByText('urgente');
  const checkmark = container.querySelector('svg[data-icon="check"]');

  expect(lblName).toBeTruthy();
  expect(checkmark).not.toBeTruthy();

  fireEvent.click(lblName);
  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(onUnSelect).toHaveBeenCalledTimes(0);

  const btnEdit = queryByTitle('Editar');
  expect(btnEdit).toBeTruthy();
  fireEvent.click(btnEdit);
  expect(onEdit).toHaveBeenCalledTimes(1);
});

test('render selected label', () => {
  const onSelect = jest.fn();
  const onUnSelect = jest.fn();
  const { container, queryByText } = render(
    <LabelItem
      label={{
        id: 'label1',
        name: 'urgente',
        color: 'red',
      }}
      selected={true}
      onSelect={onSelect}
      onUnSelect={onUnSelect}
    />
  );
  const lblName = queryByText('urgente');
  const checkmark = container.querySelector('svg[data-icon="check"]');

  expect(lblName).toBeTruthy();
  expect(checkmark).toBeTruthy();

  fireEvent.click(lblName);
  expect(onSelect).toHaveBeenCalledTimes(0);
  expect(onUnSelect).toHaveBeenCalledTimes(1);
});
