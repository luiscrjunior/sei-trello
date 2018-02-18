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

export const findAnchorByProcessNumber = (processNumber) => {
  const anchors = document.querySelectorAll('a[class^="processo"]');
  let foundAnchor = null;
  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i];
    if (anchor.textContent.trim() === processNumber) {
      foundAnchor = anchor;
      break;
    }
  }
  return foundAnchor;
};
