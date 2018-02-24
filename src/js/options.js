
let ui = {};

const defaultTokenUrl = 'https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=SEITrello';

const mapUI = () => {
  ui.appKey = document.getElementById('txt-app-key');
  ui.appToken = document.getElementById('txt-app-token');
  ui.anchorTokenUrl = document.getElementById('anchor-token-url');
  ui.lblTokenUrl = document.getElementById('lbl-token-url');
  ui.lblNoAppKeyInfo = document.getElementById('lbl-no-app-key-info');
  ui.defaultBoard = document.getElementById('txt-default-board');
  ui.defaultList = document.getElementById('txt-default-list');
  ui.btnSave = document.getElementById('btn-save');

  ui.btnSave.addEventListener('click', save);

  ui.appKey.addEventListener('input', (e) => {
    updateTokenUrl();
  });

  document.addEventListener('DOMContentLoaded', (e) => {
    updateTokenUrl();
  });

};

const updateTokenUrl = () => {
  const appKey = ui.appKey.value;
  if (appKey.length === 0) {
    ui.lblNoAppKeyInfo.style.display = 'initial';
    const tokenUrl = defaultTokenUrl + '&key=<APP KEY>';
    ui.lblTokenUrl.textContent = tokenUrl;
    ui.anchorTokenUrl.removeAttribute('href');
  } else {
    ui.lblNoAppKeyInfo.style.display = 'none';
    const tokenUrl = defaultTokenUrl + '&key=' + appKey;
    ui.lblTokenUrl.textContent = tokenUrl;
    ui.anchorTokenUrl.setAttribute('href', tokenUrl);
  }
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
    updateTokenUrl();
  });
};

document.addEventListener('DOMContentLoaded', () => {
  mapUI();
  restore();
});
