import due from 'view/components/TrelloCard/due.js';
import { format, formatISO, addDays, subDays } from 'date-fns';

test('due complete', () => {
  let dueDate = new Date();
  expect(due(formatISO(dueDate), true)).toEqual({
    message: 'concluído',
    class: 'normal',
    date: format(dueDate, 'dd/MM'),
  });

  dueDate = addDays(new Date(), 3);
  expect(due(formatISO(dueDate), false)).toEqual({
    message: '3 dias',
    class: 'normal',
    date: format(dueDate, 'dd/MM'),
  });

  dueDate = addDays(new Date(), 1);
  expect(due(formatISO(dueDate), false)).toEqual({
    message: 'amanhã',
    class: 'warning',
    date: format(dueDate, 'dd/MM'),
  });

  dueDate = new Date();
  expect(due(formatISO(dueDate), false)).toEqual({
    message: 'hoje',
    class: 'warning',
    date: format(dueDate, 'dd/MM'),
  });

  dueDate = subDays(new Date(), 3);
  expect(due(formatISO(dueDate), false)).toEqual({
    message: 'atrasado',
    class: 'error',
    date: format(dueDate, 'dd/MM'),
  });
});
