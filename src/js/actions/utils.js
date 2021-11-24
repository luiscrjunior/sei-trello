export const getDefaultBoardAndListFromStorage = () =>
  new Promise((resolve, reject) => {
    chrome.storage.sync.get(
      {
        defaultBoard: '',
        defaultList: '',
      },
      (items) => {
        if (!items.defaultBoard || !items.defaultList) {
          reject('Quadro ou lista padrão não especificados.');
          return;
        } else {
          resolve({
            defaultBoardName: items.defaultBoard,
            defaultListName: items.defaultList,
          });
        }
      }
    );
  });
