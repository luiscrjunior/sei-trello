import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Checkbox from 'view/components/ChecklistPanel/Checkbox';
import 'jest-styled-components';

test('render unchecked', () => {
  const { container } = render(<Checkbox checked={false} />);
  expect(container.firstChild).toHaveStyleRule('background-color', '#fafbfc');
  expect(container.firstChild.firstChild).toHaveStyleRule('opacity', '0');
});

test('render checked', () => {
  const { container } = render(<Checkbox checked={true} />);
  expect(container.firstChild).toHaveStyleRule('background-color', '#5ba4cf');
  expect(container.firstChild.firstChild).toHaveStyleRule('opacity', '1');
});

test('checkbox click', () => {
  const onClick = jest.fn();
  const { container } = render(<Checkbox checked={true} onClick={onClick} />);
  fireEvent.click(container.firstChild);
  expect(onClick).toHaveBeenCalledTimes(1);
});
