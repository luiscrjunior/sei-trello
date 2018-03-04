const findAllProcessAnchors = () => {
  const anchors = document.querySelectorAll('a[class^="processo"]');
  return Array.prototype.slice.call(anchors);
};

const extractRelevantDataFromRow = (row) => {

  let data = {};

  const noteAnchor = row.querySelector('a[href^="controlador.php?acao=anotacao_registrar"]');
  if (noteAnchor !== null) {
    const noteAnchorTooltipInfo = noteAnchor.getAttribute('onmouseover');
    if (noteAnchorTooltipInfo) {
      const noteAnchorInfoArray = noteAnchorTooltipInfo.split('\'');
      if (noteAnchorInfoArray.length === 5) data['note-description'] = noteAnchorInfoArray[1].replace(/\\r\\n/g, '\n');
    }
  }

  const processAnchor = row.querySelector('a[href^="controlador.php?acao=procedimento_trabalhar"]');
  if (processAnchor !== null) {
    const processAnchorTooltipInfo = processAnchor.getAttribute('onmouseover');
    if (processAnchorTooltipInfo) {
      const processAnchorInfoArray = processAnchorTooltipInfo.split('\'');
      if (processAnchorInfoArray.length === 5 && processAnchorInfoArray[1].length > 0) { 
        data['process-specification'] = processAnchorInfoArray[1];
      }
    }
  }

  return data;
};

const addTrelloMainButton = () => {
  const whereToAdd = document.querySelector('#divComandos');
  const placeHolder = document.createElement('div');
  placeHolder.classList.add('trello-main-button');
  whereToAdd.appendChild(placeHolder);
};

const addTrelloBoxes = () => {
  const anchors = findAllProcessAnchors();
  anchors.forEach((anchor) => {
    const tableRow = anchor.parentNode.parentNode;
    const tds = tableRow.querySelectorAll('td');
    const processNumber = anchor.textContent.trim();

    /* transform the row in a process-box */
    tableRow.classList.add('trello-process-box');
    tableRow.setAttribute('data-trello-process-number', processNumber);

    /* mark the anchor */
    anchor.classList.add('trello-process-anchor');

    /* add trello card placeholder */
    const cardPlaceholder = document.createElement('div');
    cardPlaceholder.classList.add('trello-card');
    tds[2].appendChild(cardPlaceholder);

    /* add create trello card button placeholder */
    const createCardPlaceHolder = document.createElement('div');
    createCardPlaceHolder.classList.add('trello-create-card-button');
    tds[1].appendChild(createCardPlaceHolder);

    /* get more data from row */
    const extraData = extractRelevantDataFromRow(tableRow);
    for (let key in extraData) tableRow.setAttribute('data-trello-' + key, extraData[key]);

  });
};

export const prepare = () => {
  addTrelloMainButton();
  addTrelloBoxes();
};
