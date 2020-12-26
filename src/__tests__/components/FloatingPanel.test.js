import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import FloatingPanel from 'view/components/FloatingPanel';

test('render panel with content and no back button', () => {
  const onClose = jest.fn();
  const { queryByText, queryByTitle } = render(
    <FloatingPanel title="Título do painel" onClose={onClose}>
      <p>Conteúdo</p>
    </FloatingPanel>
  );
  expect(queryByText('Título do painel')).toBeTruthy();
  expect(queryByText('Conteúdo')).toBeTruthy();

  const btnClose = queryByTitle('Fechar');
  expect(btnClose).toBeTruthy();
  expect(queryByTitle('Voltar')).not.toBeTruthy();

  fireEvent.click(btnClose);
  fireEvent.mouseDown(document.body);

  expect(onClose).toHaveBeenCalledTimes(2);
});

test('render panel with back button', () => {
  const onBack = jest.fn();
  const { queryByTitle } = render(<FloatingPanel title="Título do painel" onBack={onBack} showBackButton={true} />);
  const btnBack = queryByTitle('Voltar');
  expect(btnBack).toBeTruthy();

  fireEvent.click(btnBack);

  expect(onBack).toHaveBeenCalledTimes(1);
});
