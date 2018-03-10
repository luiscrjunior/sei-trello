import { isEqual } from 'lodash';
import * as store from 'model/store.js';

export default (data, processBoxes) => {

  const allProcess = Array.prototype.slice.call(processBoxes)
    .map((processBox) => processBox.getAttribute('data-trello-process-number'))
    .filter((processBox) => processBox); /* exclude null */

  const allCardsWithProcessInScreen = data.cards
    .filter((card) => allProcess.some((process) => card.processNumber === process));

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
};
