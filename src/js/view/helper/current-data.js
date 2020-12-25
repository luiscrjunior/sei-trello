import isEqual from 'lodash/isEqual';
import * as store from 'model/store.js';
import * as actions from 'actions/trello.js';

const removeOldFilters = (data) => {
  if (data.filter.locations) {
    data.filter.locations.forEach((location) => {
      const exists = data.currentLocations.some((currentLocation) => isEqual(currentLocation, location));
      if (!exists) actions.updateFilter('locations', false, location);
    });
  }
};

export default (data, processBoxes) => {
  const allProcess = Array.prototype.slice
    .call(processBoxes)
    .map((processBox) => processBox.getAttribute('data-trello-process-number'))
    .filter((processBox) => processBox); /* exclude null */

  const allCardsWithProcessInScreen = data.cards.filter((card) =>
    allProcess.some((process) => card.processNumber === process)
  );

  let uniqLabels = [];
  let uniqLocations = [];
  allCardsWithProcessInScreen.forEach((card) => {
    /* populate uniqLabels */
    card.labels.forEach((label) => {
      const labelAlreadyAdded = uniqLabels.some((labelAdded) => isEqual(labelAdded, label));
      if (!labelAlreadyAdded) uniqLabels.push(label);
    });

    /* populate uniqLocations */
    const locationAlreadyAdded = uniqLocations.some((locationAdded) => isEqual(locationAdded, card.location));
    if (!locationAlreadyAdded) uniqLocations.push(card.location);
  });

  store.setCurrentLabels(uniqLabels);
  store.setCurrentLocations(uniqLocations);

  removeOldFilters(data);
};
