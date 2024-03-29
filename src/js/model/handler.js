const removeSubstrFromStr = (startIndex, endIndex, text) => {
  const firstPart = text.substr(0, startIndex);
  const secondPart = text.substr(endIndex + 1);
  return firstPart + secondPart;
};

export const getCards = (cardList, filteredProcessNumber = null) => {
  const extractSEIInfoRegex = /^SEI\s+([0-9./-]+)$/gm;
  let cards = [];
  cardList.forEach((cardFromTrello) => {
    let match = null;
    let description = cardFromTrello.desc;
    let processList = [];
    while ((match = new RegExp(extractSEIInfoRegex).exec(description))) {
      processList.push(match[1]);
      description = removeSubstrFromStr(match.index, match.index + match[0].length, description);
    }
    if (filteredProcessNumber) {
      processList = processList.filter((processNumber) => filteredProcessNumber === processNumber);
    }
    processList.forEach((processNumber) => {
      cards.push({
        isLoading: false,
        processNumber: processNumber,
        cardID: cardFromTrello.id,
        name: cardFromTrello.name,
        description: description.trim(),
        due: cardFromTrello.due,
        dueComplete: cardFromTrello.dueComplete,
        labels: [...cardFromTrello.labels],
        location: {
          board: cardFromTrello.board
            ? {
                id: cardFromTrello.board.id,
                name: cardFromTrello.board.name,
              }
            : null,
          list: cardFromTrello.list
            ? {
                id: cardFromTrello.list.id,
                name: cardFromTrello.list.name,
              }
            : null,
        },
        url: cardFromTrello.shortUrl,
        hasChecklist: 'idChecklists' in cardFromTrello && cardFromTrello.idChecklists.length > 0,
      });
    });
  });
  return cards;
};

export const getCardsFromBoard = (lists, board) => {
  const cards = [];
  for (const list of lists) {
    for (const cardFromList of list.cards) {
      const listData = { ...list };
      delete listData['cards'];
      cards.push({
        ...cardFromList,
        list: listData,
        board: { ...board },
      });
    }
  }
  return cards;
};
