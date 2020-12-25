import parseISO from 'date-fns/parseISO';
import set from 'date-fns/set';
import differenceInDays from 'date-fns/differenceInDays';
import format from 'date-fns/format';

export default (due, dueComplete) => {
  let dueDate = parseISO(due);
  dueDate = set(dueDate, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
  const today = set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
  const diffDays = differenceInDays(dueDate, today);

  let className = 'normal';
  if (!dueComplete) {
    if (diffDays < 0) {
      className = 'error';
    } else if (diffDays < 3) {
      className = 'warning';
    }
  }

  let message = diffDays.toString() + ' dias';
  if (dueComplete) {
    message = 'concluído';
  } else {
    if (diffDays < 0) {
      message = 'atrasado';
    } else if (diffDays === 0) {
      message = 'hoje';
    } else if (diffDays === 1) {
      message = 'amanhã';
    }
  }

  return {
    date: format(dueDate, 'dd/MM'),
    class: className,
    message: message,
  };
};
