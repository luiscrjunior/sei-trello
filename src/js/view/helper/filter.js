import { isEqual } from 'lodash';

const isFilterPassed = (filterChecks) => {
  for (let k in filterChecks) {
    if (filterChecks[k].show === false) return false;
  }
  return true;
};

const mustShowLabels = (filter, hasTrelloCard, card) => {

  if (!hasTrelloCard) return false; /* don't show if there is no card */

  if (
    filter.indexOf('NO_LABEL') > -1 && card.labels.length === 0
  ) return true;

  if (
    filter.some((filterLabel) => card.labels.some((cardLabel) => isEqual(cardLabel, filterLabel)))
  ) return true;

  return false;
};

const mustShowDue = (filter, hasTrelloCard, card) => {

  if (!hasTrelloCard) return false; /* don't show if there is no card */

  if (
    filter === 'WITH_INCOMPLETE_DUE' &&
    card.due !== null && card.dueComplete === false
  ) return true;

  if (
    filter === 'WITH_COMPLETE_DUE' &&
    card.dueComplete === true
  ) return true;

  if (
    filter === 'WITHOUT_DUE' &&
    card.due === null
  ) return true;

  return false;
};

const mustShowLocations = (filter, hasTrelloCard, card) => {

  if (!hasTrelloCard) return false; /* don't show if there is no card */

  if (
    filter.some((filterLocation) => isEqual(card.location, filterLocation))
  ) return true;

  return false;
};

const mustShowProcesses = (filter, hasTrelloCard, card) => {

  if (
    filter === 'WITHOUT_CARD' && !hasTrelloCard
  ) return true;

  return false;
};

export const isFilterEmpty = (filter) => {
  for (let k in filter) {
    if (filter[k] !== null) return false;
  }
  return true;
};

export const mustShow = (filter, hasTrelloCard, card) => {

  if (isFilterEmpty(filter)) return true;

  const filterChecks = {
    'labels': {
      show: true,
      check: mustShowLabels,
    },
    'due': {
      show: true,
      check: mustShowDue,
    },
    'locations': {
      show: true,
      check: mustShowLocations,
    },
    'processes': {
      show: true,
      check: mustShowProcesses,
    },
  };

  for (let k in filterChecks) {
    if (!(k in filter) || filter[k] === null) {
      filterChecks[k].show = true;
    } else {
      filterChecks[k].show = filterChecks[k].check(filter[k], hasTrelloCard, card);
    }
  }

  return isFilterPassed(filterChecks);
};
