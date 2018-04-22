import * as analytics from 'utils/analytics.js';

chrome.runtime.onMessage.addListener((msg, sender) => {
  if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
    chrome.pageAction.show(sender.tab.id);
  }
});

analytics.load();
