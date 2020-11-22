import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import EditableParagraph from 'view/components/EditableParagraph';
import 'jest-styled-components';

test('render empty', () => {
  render(<EditableParagraph />);
  expect(screen.queryByText('Clique para editar...')).toBeTruthy();

  cleanup();

  render(<EditableParagraph value={null} />);
  expect(screen.queryByText('Clique para editar...')).toBeTruthy();

  cleanup();

  render(<EditableParagraph value={undefined} />);
  expect(screen.queryByText('Clique para editar...')).toBeTruthy();
});

test('render with value', () => {
  render(<EditableParagraph value="teste..." />);
  expect(screen.queryByText('teste...')).toBeTruthy();
});

test('edit clicking outside', () => {
  const onChange = jest.fn();
  const onChangeState = jest.fn();
  const { container, queryByText, getByDisplayValue } = render(
    <EditableParagraph onChangeState={onChangeState} onChange={onChange} />
  );

  expect(onChangeState).toHaveBeenNthCalledWith(1, 'show');
  expect(queryByText('Clique para editar...')).toBeTruthy();

  fireEvent.click(queryByText('Clique para editar...'));
  expect(onChangeState).toHaveBeenNthCalledWith(2, 'edit');
  expect(getByDisplayValue('')).toBeTruthy();

  fireEvent.change(getByDisplayValue(''), { target: { value: 'minha descrição' } });
  fireEvent.click(container);

  expect(onChangeState).toHaveBeenNthCalledWith(3, 'show');
  expect(onChange).toHaveBeenNthCalledWith(1, 'minha descrição');
});

test('edit with enter (without shift)', () => {
  const onChange = jest.fn();
  const onChangeState = jest.fn();
  const { queryByText, getByDisplayValue } = render(
    <EditableParagraph onChangeState={onChangeState} onChange={onChange} />
  );

  expect(onChangeState).toHaveBeenNthCalledWith(1, 'show');
  expect(queryByText('Clique para editar...')).toBeTruthy();

  fireEvent.click(queryByText('Clique para editar...'));
  expect(onChangeState).toHaveBeenNthCalledWith(2, 'edit');
  expect(getByDisplayValue('')).toBeTruthy();

  fireEvent.change(getByDisplayValue(''), { target: { value: 'minha descrição' } });
  expect(getByDisplayValue('minha descrição')).toBeTruthy();

  fireEvent.keyDown(getByDisplayValue('minha descrição'), {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    shiftKey: true,
  });

  fireEvent.keyDown(getByDisplayValue('minha descrição'), {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    shiftKey: false,
  });

  expect(onChangeState).toHaveBeenCalledTimes(3); /* não conta quando shift foi pressionado */
  expect(onChangeState).toHaveBeenNthCalledWith(3, 'show');
  expect(onChange).toHaveBeenNthCalledWith(1, 'minha descrição');
});
