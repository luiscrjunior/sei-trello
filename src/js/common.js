/* show page action icon */

chrome.runtime.sendMessage(null, {
  from: 'content',
  subject: 'showPageAction',
});

document.addEventListener('click', (el) => {
  if (el.target.classList.contains('btn-open-extension-option')) {
    chrome.runtime.sendMessage(null, {
      from: 'content',
      subject: 'showOptionsPage',
    });
  }
});
