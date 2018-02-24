export const getBoards = (boardList) => {
  return boardList.map((board) => {
    return {
      name: board.name,
      id: board.id,
    };
  });
};

export const getLists = (boardList) => {
  let lists = [];
  boardList.forEach((board) => {
    lists = lists.concat(board.lists.map((list) => {
      return {
        boardID: board.id,
        id: list.id,
        name: list.name,
      };
    }));
  });
  return lists;
};

export const getCards = (cardList) => {
  const extractSEIInfoRegex = /^SEI\s{1,}(\d+.\d+\/\d+-\d+).{0,}$/gm;
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

const removeSubstrFromStr = (startIndex, endIndex, text) => {
  const firstPart = text.substr(0, startIndex);
  const secondPart = text.substr(endIndex + 1);
  return firstPart + secondPart;
};

export const extractRelevantInfoFromRow = (processNumber, row) => {
  let info = {
    name: processNumber,
    desc: 'SEI ' + processNumber,
  };

  const noteAnchor = row.querySelector('a[href^="controlador.php?acao=anotacao_registrar"]');
  if (noteAnchor !== null) {
    const noteAnchorTooltipInfo = noteAnchor.getAttribute('onmouseover');
    if (noteAnchorTooltipInfo) {
      const noteAnchorInfoArray = noteAnchorTooltipInfo.split('\'');
      if (noteAnchorInfoArray.length === 5) info.desc = info.desc + '\n' + noteAnchorInfoArray[1].replace(/\\r\\n/g, '\n');
    }
  }

  const processAnchor = row.querySelector('a[href^="controlador.php?acao=procedimento_trabalhar"]');
  if (processAnchor !== null) {
    const processAnchorTooltipInfo = processAnchor.getAttribute('onmouseover');
    if (processAnchorTooltipInfo) {
      const processAnchorInfoArray = processAnchorTooltipInfo.split('\'');
      if (processAnchorInfoArray.length === 5 && processAnchorInfoArray[1].length > 0) info.name = processAnchorInfoArray[1];
    }
  }

  return info;
};
