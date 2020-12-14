import initialCards from './data/cards.js';
import initialBoards from './data/boards.js';
import initialLists from './data/lists.js';

const Api = () => {
  let cards = [...initialCards];
  let boards = [...initialBoards];
  let lists = [...initialLists];

  const jsonResponse = (data) => ({
    status: 200,
    content: 'application/json',
    body: JSON.stringify(data),
  });

  const emptyCardData = (cardID) => ({
    id: cardID,
    name: '',
    desc: '',
    due: null,
    dueComplete: false,
    checklists: [],
    idChecklists: [],
    labels: [],
    board: boards[0],
    list: lists[0],
    shortUrl: `https://trello.com/c/${cardID}`,
  });

  const getGreaterPos = (arr) =>
    arr.reduce((acc, item) => {
      return item.pos > acc ? item.pos : acc;
    }, 0);

  const getLowerPos = (arr) =>
    arr.reduce((acc, item) => {
      return item.pos < acc ? item.pos : acc;
    }, 0);

  const getBoardById = (boardID) => boards.find((board) => board.id === boardID);
  const getListById = (listID) => lists.find((list) => list.id === listID);
  const getCardById = (cardID) => cards.find((card) => card.id === cardID);

  const updateCardData = (cardID, data) => {
    if ('idBoard' in data) {
      data.board = getBoardById(data.idBoard);
      delete data['idBoard'];
    }
    if ('idList' in data) {
      data.list = getListById(data.idList);
      delete data['idList'];
    }
    if (data.due === 'null') data.due = null;
    cards = cards.map((card) => (card.id === cardID ? { ...card, ...data } : card));
    return getCardById(cardID);
  };

  const createCard = (data) => {
    const id = `card${cards.length + 1}`;
    const newCard = {
      ...emptyCardData(id),
      name: data.name,
      desc: data.desc,
    };
    cards = [...cards, newCard];
    return newCard;
  };

  const deleteCard = (cardID) => {
    cards = cards.filter((card) => card.id === cardID);
    return true;
  };

  const createChecklist = (data) => {
    const card = getCardById(data.idCard);
    const checklist = {
      id: `${card.id}_checklist${card.checklists.length + 1}`,
      idBoard: card.board.id,
      idCard: card.id,
      name: data.name,
      checkItems: [],
    };
    updateCardData(data.idCard, { checklists: [...card.checklists, checklist] });
    return checklist;
  };

  const addChecklistItem = (checklistID, data) => {
    for (const card of cards) {
      for (const checklist of card.checklists) {
        if (checklist.id === checklistID) {
          const greaterPos = getGreaterPos(checklist.checkItems);
          const checkItem = {
            id: `${checklist.id}_checkitem${checklist.checkItems.length + 1}`,
            idChecklist: checklistID,
            name: data.name,
            state: data.state,
            pos: greaterPos + 100,
          };
          checklist.checkItems.push(checkItem);
          return checkItem;
        }
      }
    }
    return null;
  };

  const updateChecklistItem = (cardID, checkItemID, data) => {
    const card = getCardById(cardID);
    for (const checklist of card.checklists) {
      for (const checkItem of checklist.checkItems) {
        if (checkItem.id === checkItemID) {
          if ('name' in data) checkItem.name = data.name;
          if ('state' in data) checkItem.state = data.state;
          if ('pos' in data) {
            if (data.pos === 'top') {
              checkItem.pos = getLowerPos(checklist.checkItems) - 100;
            } else if (data.pos === 'bottom') {
              checkItem.pos = getGreaterPos(checklist.checkItems) + 100;
            } else {
              checkItem.pos = data.pos;
            }
          }
          return checkItem;
        }
      }
    }
    return null;
  };

  const deleteChecklistItem = (checklistID, checkItemID) => {
    for (const card of cards) {
      for (const checklist of card.checklists) {
        if (checklist.id === checklistID) {
          checklist.checkItems = checklist.checkItems.filter((checkItem) => checkItem.id !== checkItemID);
        }
      }
    }
    return null;
  };

  const deleteCardChecklist = (checklistID) => {
    for (const card of cards) {
      card.checklists = card.checklists.filter((checklist) => checklist.id !== checklistID);
    }
    return null;
  };

  const handleRequests = (request) => {
    let match = null;

    /* searchCards */
    if (/api\.trello\.com\/1\/search\?.*modelTypes=cards/.test(request.url())) {
      request.respond(jsonResponse({ cards: cards }));

      /* searchAllBoards and searchBoardsByName */
    } else if (/api\.trello\.com\/1\/search\?.*modelTypes=boards/.test(request.url())) {
      request.respond(jsonResponse({ boards: boards }));

      /* getListsFromBoard */
    } else if (/api\.trello\.com\/1\/boards\/.*lists=open/.test(request.url())) {
      request.respond(jsonResponse({ lists: lists }));

      /* getCardData */
    } else if (request.method() === 'GET' && (match = request.url().match(/api\.trello\.com\/1\/cards\/([^/]+)\?/))) {
      const [, cardID] = match;
      request.respond(jsonResponse({ ...getCardById(cardID) }));

      /* updateCard */
    } else if (request.method() === 'PUT' && (match = request.url().match(/api\.trello\.com\/1\/cards\/([^/]+)$/))) {
      const [, cardID] = match;
      // eslint-disable-next-line no-unused-vars
      const { key, token, ...data } = JSON.parse(request.postData());
      request.respond(jsonResponse({ ...updateCardData(cardID, data) }));

      /* createCard */
    } else if (request.method() === 'POST' && (match = request.url().match(/api\.trello\.com\/1\/cards/))) {
      // eslint-disable-next-line no-unused-vars
      const data = JSON.parse(request.postData());
      const cardData = createCard(data);
      request.respond(jsonResponse(cardData));

      /* deleteCard */
    } else if (request.method() === 'DELETE' && (match = request.url().match(/api\.trello\.com\/1\/cards\/(.+)/))) {
      const [, cardID] = match;
      deleteCard(cardID);
      request.respond(jsonResponse({}));

      /* getCardChecklistData */
    } else if (
      request.method() === 'GET' &&
      (match = request.url().match(/api\.trello\.com\/1\/cards\/(.+)\/checklists\?.*checkItems=all/))
    ) {
      const [, cardID] = match;
      request.respond(jsonResponse(getCardById(cardID).checklists));

      /* createCardChecklist */
    } else if (request.method() === 'POST' && (match = request.url().match(/api\.trello\.com\/1\/checklists$/))) {
      // eslint-disable-next-line no-unused-vars
      const data = JSON.parse(request.postData());
      const checklist = createChecklist(data);
      request.respond(jsonResponse(checklist));

      /* createCardChecklistItem */
    } else if (
      request.method() === 'POST' &&
      (match = request.url().match(/api\.trello\.com\/1\/checklists\/(.+)\/checkItems$/))
    ) {
      const [, checklistID] = match;
      // eslint-disable-next-line no-unused-vars
      const data = JSON.parse(request.postData());
      const checkItem = addChecklistItem(checklistID, data);
      request.respond(jsonResponse(checkItem));

      /* updateCardChecklistItem */
    } else if (
      request.method() === 'PUT' &&
      (match = request.url().match(/api\.trello\.com\/1\/cards\/(.+)\/checkItem\/(.+)$/))
    ) {
      const [, cardID, checkItemID] = match;
      // eslint-disable-next-line no-unused-vars
      const data = JSON.parse(request.postData());
      const checkItem = updateChecklistItem(cardID, checkItemID, data);
      request.respond(jsonResponse(checkItem));

      /* deleteCardChecklistItem */
    } else if (
      request.method() === 'DELETE' &&
      (match = request.url().match(/api\.trello\.com\/1\/checklists\/(.+)\/checkItems\/(.+)\?/))
    ) {
      const [, checklistID, checkItemID] = match;
      deleteChecklistItem(checklistID, checkItemID);
      request.respond(jsonResponse({}));

      /* deleteCardChecklist */
    } else if (
      request.method() === 'DELETE' &&
      (match = request.url().match(/api\.trello\.com\/1\/checklists\/([^/]+)\?/))
    ) {
      const [, checklistID] = match;
      deleteCardChecklist(checklistID);
      request.respond(jsonResponse({}));

      /* outros requests */
    } else {
      request.continue();
    }
  };

  return {
    handleRequests: handleRequests,
    clearCards: () => (cards = []),
    addCard: (card, cardID = 'card1') =>
      (cards = [
        ...cards,
        {
          ...emptyCardData(cardID),
          ...card,
        },
      ]),
    updateCard: updateCardData,
    setBoards: (newBoards) => (boards = newBoards),
    setLists: (newLists) => (lists = newLists),
  };
};

export default Api();
