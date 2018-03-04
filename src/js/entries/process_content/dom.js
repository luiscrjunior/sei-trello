const getProcessNumber = () => {
  const lastScript = document.scripts[document.scripts.length - 1];
  const scriptContent = lastScript.innerText;
  const regex = /Nos\[0\] = new infraArvoreNo\(.*?(\d+?\.\d+?\/\d+?-\d{2}).*;/;
  const match = regex.exec(scriptContent);
  if (!match || match.length !== 2) return null;
  return match[1];
};

const addTrelloBox = () => {

  const body = document.querySelector('body');
  const mainForm = document.querySelector('form#frmArvore');

  const trelloBox = document.createElement('div');
  trelloBox.classList.add('trello-process-box');

  const processNumber = getProcessNumber();
  trelloBox.setAttribute('data-trello-process-number', processNumber);

  /* add trello card placeholder */
  const cardPlaceholder = document.createElement('div');
  cardPlaceholder.classList.add('trello-card');
  cardPlaceholder.setAttribute('full-width', null);
  trelloBox.appendChild(cardPlaceholder);

  /* add create trello card button placeholder */
  const createCardPlaceHolder = document.createElement('div');
  createCardPlaceHolder.classList.add('trello-create-card-button');
  trelloBox.appendChild(createCardPlaceHolder);

  body.insertBefore(trelloBox, mainForm);

};

export const prepare = () => {
  addTrelloBox();
};
