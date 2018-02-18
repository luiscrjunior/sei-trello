const urlToFilter = {
  url: [
    {
      urlMatches: '/sei/controlador.php',
      queryContains: 'acao=procedimento_controlar',
    },
  ],
};

chrome.webNavigation.onCompleted.addListener((details) => {
  chrome.tabs.executeScript(details.tabId, { file: 'js/default.js' });
  chrome.tabs.insertCSS(details.tabId, { file: 'css/default.css' });
  chrome.tabs.insertCSS(details.tabId, { file: 'vendor/css/fontawesome-all.css' });
  chrome.pageAction.show(details.tabId);
}, urlToFilter);
