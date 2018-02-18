export const addTrelloButtonPlaceHolder = () => {
  const whereToAdd = document.querySelector('#divComandos');
  const placeHolder = document.createElement('div');
  placeHolder.setAttribute('id', 'trello-button-placeholder');
  whereToAdd.appendChild(placeHolder);
};

export const findAllProcessAnchors = () => {
  const anchors = document.querySelectorAll('a[class^="processo"]');
  return Array.prototype.slice.call(anchors);
};

export const addAddTrelloCardPlaceHolders = () => {
  const anchors = findAllProcessAnchors();
  anchors.forEach((anchor) => {
    const tableRow = anchor.parentNode.parentNode;
    const tds = tableRow.querySelectorAll('td');
    const whereToAdd = tds[1];
    const placeHolder = document.createElement('div');
    placeHolder.setAttribute('class', 'trello-add-card-button-placeholder');
    whereToAdd.appendChild(placeHolder);
  });
};
