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
      id: id,
      name: data.name,
      desc: data.desc,
      due: null,
      dueComplete: false,
      idChecklists: [],
      labels: [],
      board: boards[0],
      list: lists[0],
      shortUrl: `https://trello.com/c/${id}`,
    };
    cards = [...cards, newCard];
    return newCard;
  };

  const deleteCard = (cardID) => {
    cards = cards.filter((card) => card.id === cardID);
    return true;
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
    } else if (request.method() === 'GET' && (match = request.url().match(/api\.trello\.com\/1\/cards\/(.+)\?/))) {
      const [, cardID] = match;
      request.respond(jsonResponse({ ...getCardById(cardID) }));

      /* updateCard */
    } else if (request.method() === 'PUT' && (match = request.url().match(/api\.trello\.com\/1\/cards\/(.+)/))) {
      const [, cardID] = match;
      // eslint-disable-next-line no-unused-vars
      const { key, token, ...data } = JSON.parse(request.postData());
      console.log(cardID, data);
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
          id: cardID,
          name: '',
          desc: '',
          due: null,
          dueComplete: false,
          idChecklists: [],
          labels: [],
          shortUrl: `https://trello.com/c/${cardID}`,
          board: boards[0],
          list: lists[0],
          ...card,
        },
      ]),
    updateCard: updateCardData,
    setBoards: (newBoards) => (boards = newBoards),
    setLists: (newLists) => (lists = newLists),
  };
};

export default Api();
