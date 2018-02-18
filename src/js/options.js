
let ui = {};

const mapUI = () => {
  ui.appKey = document.getElementById('txt-app-key');
  ui.appToken = document.getElementById('txt-app-token');
  ui.btnSave = document.getElementById('btn-save');

  ui.btnSave.addEventListener('click', save);
};

const save = () => {
  chrome.storage.sync.set({
    appKey: ui.appKey.value,
    appToken: ui.appToken.value,
  });
};

const restore = () => {
  chrome.storage.sync.get({
    appKey: '',
    appToken: '',
  }, (items) => {
    ui.appKey.value = items.appKey;
    ui.appToken.value = items.appToken;
  });
};

document.addEventListener('DOMContentLoaded', () => {
  mapUI();
  restore();
});
