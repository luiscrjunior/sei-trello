import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import EditableParagraph from 'view/components/EditableParagraphV2';
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

test('render with edit mode', () => {
  const onChangeState = jest.fn();
  const { getByDisplayValue, queryByText } = render(
    <EditableParagraph onChangeState={onChangeState} value="teste..." editing buttons={['save']} />
  );
  expect(getByDisplayValue('teste...')).toBeTruthy();
  expect(queryByText('Salvar')).toBeTruthy();
  expect(onChangeState).toHaveBeenNthCalledWith(1, 'edit');
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
  fireEvent.mouseDown(container);

  expect(onChange).toHaveBeenNthCalledWith(1, 'minha descrição');
  expect(onChangeState).toHaveBeenNthCalledWith(3, 'show');
});

test('edit clicking next to buttons', () => {
  const onChange = jest.fn();
  const onChangeState = jest.fn();
  const { container, getByDisplayValue } = render(
    <EditableParagraph
      onChangeState={onChangeState}
      onChange={onChange}
      editing
      value="minha descrição"
      buttons={['save', 'cancel']}
    />
  );

  expect(onChangeState).toHaveBeenNthCalledWith(1, 'edit');
  expect(getByDisplayValue('minha descrição')).toBeTruthy();

  fireEvent.change(getByDisplayValue('minha descrição'), { target: { value: 'minha outra descrição' } });

  const buttonPanel = container.querySelector('button').parentNode;
  fireEvent.mouseDown(buttonPanel);

  expect(onChange).toHaveBeenNthCalledWith(1, 'minha outra descrição');
  expect(onChangeState).toHaveBeenNthCalledWith(2, 'show');
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

test('cancel edit with ESC', () => {
  const onChange = jest.fn();
  const onCancel = jest.fn();
  const onChangeState = jest.fn();
  const { queryByText, getByDisplayValue } = render(
    <EditableParagraph onChangeState={onChangeState} onChange={onChange} onCancel={onCancel} value="minha descrição" />
  );

  expect(onChangeState).toHaveBeenNthCalledWith(1, 'show');
  expect(queryByText('minha descrição')).toBeTruthy();

  fireEvent.click(queryByText('minha descrição'));
  expect(onChangeState).toHaveBeenNthCalledWith(2, 'edit');
  expect(getByDisplayValue('minha descrição')).toBeTruthy();

  fireEvent.change(getByDisplayValue('minha descrição'), { target: { value: 'minha outra descrição' } });
  expect(getByDisplayValue('minha outra descrição')).toBeTruthy();
  fireEvent.keyDown(getByDisplayValue('minha outra descrição'), {
    key: 'Esc',
    code: 'Esc',
    keyCode: 27,
  });

  expect(onChangeState).toHaveBeenNthCalledWith(3, 'show');
  expect(queryByText('minha descrição')).toBeTruthy();
  expect(onCancel).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledTimes(0);
});

test('edit with buttons', () => {
  const onChange = jest.fn();
  const onCancel = jest.fn();
  const onRemove = jest.fn();
  const onChangeState = jest.fn();
  const { queryByText, getByDisplayValue } = render(
    <EditableParagraph
      onChangeState={onChangeState}
      onChange={onChange}
      onCancel={onCancel}
      onRemove={onRemove}
      value="minha descrição"
      buttons={['add', 'save', 'cancel', 'remove']}
    />
  );

  expect(onChangeState).toHaveBeenNthCalledWith(1, 'show');
  expect(queryByText('minha descrição')).toBeTruthy();

  fireEvent.click(queryByText('minha descrição'));
  expect(onChangeState).toHaveBeenNthCalledWith(2, 'edit');
  expect(getByDisplayValue('minha descrição')).toBeTruthy();

  expect(queryByText('Adicionar')).toBeTruthy();
  expect(queryByText('Salvar')).toBeTruthy();
  expect(queryByText('Remover')).toBeTruthy();
  expect(queryByText('Cancelar')).toBeTruthy();

  /* botão salvar */
  fireEvent.change(getByDisplayValue('minha descrição'), { target: { value: 'minha nova descrição' } });
  expect(getByDisplayValue('minha nova descrição')).toBeTruthy();
  fireEvent.click(queryByText('Salvar'));
  expect(onChange).toHaveBeenNthCalledWith(1, 'minha nova descrição');
  expect(queryByText('minha descrição')).toBeTruthy();

  /* botão adicionar */
  fireEvent.click(queryByText('minha descrição'));
  expect(getByDisplayValue('minha descrição')).toBeTruthy();
  fireEvent.change(getByDisplayValue('minha descrição'), { target: { value: 'minha nova descrição' } });
  fireEvent.click(queryByText('Adicionar'));
  expect(onChange).toHaveBeenNthCalledWith(2, 'minha nova descrição');

  /* botão remover */
  fireEvent.click(queryByText('minha descrição'));
  expect(getByDisplayValue('minha descrição')).toBeTruthy();
  fireEvent.click(queryByText('Remover'));
  expect(onRemove).toHaveBeenCalledTimes(1);

  /* botão cancelar */
  fireEvent.click(queryByText('minha descrição'));
  expect(getByDisplayValue('minha descrição')).toBeTruthy();
  fireEvent.change(getByDisplayValue('minha descrição'), { target: { value: 'minha nova descrição' } });
  fireEvent.click(queryByText('Cancelar'));
  expect(onCancel).toHaveBeenCalledTimes(1);
  expect(queryByText('minha descrição')).toBeTruthy();
});
