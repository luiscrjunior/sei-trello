import moment from 'moment';

export default (due, dueComplete) => {
  let dueDate = moment(due);
  dueDate.set({hour: 0, minute: 0, second: 0, millisecond: 0});
  const today = moment().set({hour: 0, minute: 0, second: 0, millisecond: 0});
  const diffDays = dueDate.diff(today, 'days');

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
    date: dueDate.format('DD/MM'),
    class: className,
    message: message,
  };
};
