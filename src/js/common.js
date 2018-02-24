
/* show page action icon */

chrome.runtime.sendMessage(null, {
  from: 'content',
  subject: 'showPageAction',
});
