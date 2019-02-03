const removeSubstrFromStr = (startIndex, endIndex, text) => {
  const firstPart = text.substr(0, startIndex);
  const secondPart = text.substr(endIndex + 1);
  return firstPart + secondPart;
};

export const getCards = (cardList) => {
  const extractSEIInfoRegex = /^SEI\s{1,}(\d+.\d+\/\d+(?:-\d+){0,}).{0,}$/gm;
  let cards = [];
  cardList.forEach((cardFromTrello) => {
    let match = null;
    let description = cardFromTrello.desc;
    let processList = [];
    while ((match = new RegExp(extractSEIInfoRegex).exec(description))) {
      processList.push(match[1]);
      description = removeSubstrFromStr(match.index, (match.index + match[0].length), description);
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
        labels: cardFromTrello.labels.map((label) => {
          return {
            color: label.color,
            label: label.name,
          };
        }),
        location: {
          board: (cardFromTrello.board ? {
            id: cardFromTrello.board.id,
            name: cardFromTrello.board.name,
          } : null),
          list: (cardFromTrello.list ? {
            id: cardFromTrello.list.id,
            name: cardFromTrello.list.name,
          } : null),
        },
        url: cardFromTrello.shortUrl,
      });
    });
  });
  return cards;
};
