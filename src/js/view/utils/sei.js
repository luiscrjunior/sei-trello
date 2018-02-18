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
