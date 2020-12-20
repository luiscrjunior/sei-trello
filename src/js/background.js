import * as analytics from 'utils/analytics.js';

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.from === 'content' && msg.subject === 'showPageAction') {
    chrome.pageAction.show(sender.tab.id);
  }
  if (msg.from === 'content' && msg.subject === 'showOptionsPage') {
    chrome.runtime.openOptionsPage();
  }
});

analytics.load();
