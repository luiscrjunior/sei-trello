export const findAllProcessAnchors = () => {
  const anchors = document.querySelectorAll('a[class^="processo"]');
  return Array.prototype.slice.call(anchors);
};

export const addTrelloButtonPlaceHolder = () => {
  const whereToAdd = document.querySelector('#divComandos');
  const placeHolder = document.createElement('div');
  placeHolder.setAttribute('id', 'trello-button-placeholder');
  whereToAdd.appendChild(placeHolder);
};

export const addTrelloCardPlaceHolders = () => {
  const anchors = findAllProcessAnchors();
  anchors.forEach((anchor) => {
    const tableRow = anchor.parentNode.parentNode;
    const tds = tableRow.querySelectorAll('td');

    /* add trello card placeholder */
    const cardPlaceholder = document.createElement('div');
    cardPlaceholder.setAttribute('class', 'trello-card-placeholder');
    tds[2].appendChild(cardPlaceholder);

    /* add create trello card button placeholder */
    const createCardPlaceHolder = document.createElement('div');
    createCardPlaceHolder.setAttribute('class', 'trello-create-card-button-placeholder');
    tds[1].appendChild(createCardPlaceHolder);

  });
};
