
let ui = {};

const mapUI = () => {
  ui.appKey = document.getElementById('txt-app-key');
  ui.appToken = document.getElementById('txt-app-token');
  ui.defaultBoard = document.getElementById('txt-default-board');
  ui.defaultList = document.getElementById('txt-default-list');
  ui.btnSave = document.getElementById('btn-save');

  ui.btnSave.addEventListener('click', save);
};

const save = () => {
  chrome.storage.sync.set({
    appKey: ui.appKey.value,
    appToken: ui.appToken.value,
    defaultBoard: ui.defaultBoard.value,
    defaultList: ui.defaultList.value,
  });
};

const restore = () => {
  chrome.storage.sync.get({
    appKey: '',
    appToken: '',
    defaultBoard: '',
    defaultList: '',
  }, (items) => {
    ui.appKey.value = items.appKey;
    ui.appToken.value = items.appToken;
    ui.defaultBoard.value = items.defaultBoard;
    ui.defaultList.value = items.defaultList;
  });
};

document.addEventListener('DOMContentLoaded', () => {
  mapUI();
  restore();
});
