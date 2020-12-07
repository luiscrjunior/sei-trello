import React from 'react';
import { render } from '@testing-library/react';
import ChecklistPanel from 'view/components/ChecklistPanel';
import 'jest-styled-components';

import * as api from 'api/trello.js';

jest.mock('api/trello.js');

const items = {
  data: [
    {
      id: 'id1',
      name: 'Checklist',
      checkItems: [
        {
          id: 'item1',
          name: 'Tarefa 1',
          state: 'complete',
        },
        {
          id: 'item2',
          name: 'Tarefa 2',
          state: 'incomplete',
        },
        {
          id: 'item3',
          name: 'Tarefa 3',
          state: 'incomplete',
        },
      ],
    },
  ],
};

const onClose = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

test('render tasks', async () => {
  api.getCardChecklistData.mockResolvedValue(items);
  const { findByText } = render(<ChecklistPanel cardID="1" onClose={onClose} />);

  expect(await findByText('Tarefa 1')).toBeTruthy();
  expect(await findByText('Tarefa 2')).toBeTruthy();
  expect(await findByText('Tarefa 3')).toBeTruthy();

  expect((await findByText('Tarefa 1')).closest('li').querySelector('div:first-child')).toHaveStyleRule(
    'background-color',
    '#5ba4cf'
  );

  expect((await findByText('Tarefa 2')).closest('li').querySelector('div:first-child')).toHaveStyleRule(
    'background-color',
    '#fafbfc'
  );
});

test('render empty task', async () => {
  api.getCardChecklistData.mockResolvedValue({ data: [] });
  const { findByText } = render(<ChecklistPanel cardID="1" onClose={onClose} />);

  expect(await findByText('Você não possui itens no checklist.')).toBeTruthy();
});
